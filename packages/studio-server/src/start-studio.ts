import type {WebpackOverrideFn} from '@remotion/bundler';
import type {LogLevel} from '@remotion/renderer';
import {RenderInternals} from '@remotion/renderer';
import type {
	GitSource,
	RenderDefaults,
	RenderJob,
} from '@remotion/studio-shared';
import crypto from 'node:crypto';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {openBrowser} from './better-opn';
import {getNetworkAddress} from './get-network-address';
import type {QueueMethods} from './preview-server/api-types';
import {getAbsolutePublicDir} from './preview-server/get-absolute-public-dir';
import {
	setLiveEventsListener,
	waitForLiveEventsListener,
} from './preview-server/live-events';
import {getFiles, initPublicFolderWatch} from './preview-server/public-folder';
import {startServer} from './preview-server/start-server';
import {printServerReadyComment, setServerReadyComment} from './server-ready';
import {watchRootFile} from './watch-root-file';

const noop = () => undefined;

const getShouldOpenBrowser = ({
	configValueShouldOpenBrowser,
	parsedCliOpen,
}: {
	configValueShouldOpenBrowser: boolean;
	parsedCliOpen: boolean;
}): {
	shouldOpenBrowser: boolean;
	reasonForBrowserDecision: string;
} => {
	if (parsedCliOpen === false) {
		return {
			shouldOpenBrowser: false,
			reasonForBrowserDecision: '--no-open specified',
		};
	}

	if ((process.env.BROWSER ?? '').toLowerCase() === 'none') {
		return {
			shouldOpenBrowser: false,
			reasonForBrowserDecision: 'env BROWSER=none was set',
		};
	}

	if (configValueShouldOpenBrowser === false) {
		return {shouldOpenBrowser: false, reasonForBrowserDecision: 'Config file'};
	}

	return {shouldOpenBrowser: true, reasonForBrowserDecision: 'default'};
};

export const startStudio = async ({
	browserArgs,
	browserFlag,
	configValueShouldOpenBrowser,
	fullEntryPath,
	logLevel,
	getCurrentInputProps,
	getEnvVariables,
	desiredPort,
	maxTimelineTracks,
	remotionRoot,
	keyboardShortcutsEnabled,
	userPassedPublicDir,
	webpackOverride,
	poll,
	getRenderDefaults,
	getRenderQueue,
	numberOfAudioTags,
	queueMethods,
	parsedCliOpen,
	previewEntry,
	gitSource,
	bufferStateDelayInMilliseconds,
}: {
	browserArgs: string;
	browserFlag: string;
	logLevel: LogLevel;
	configValueShouldOpenBrowser: boolean;
	fullEntryPath: string;
	getCurrentInputProps: () => object;
	getEnvVariables: () => Record<string, string>;
	desiredPort: number | null;
	maxTimelineTracks: number | null;
	bufferStateDelayInMilliseconds: number | null;
	remotionRoot: string;
	keyboardShortcutsEnabled: boolean;
	userPassedPublicDir: string | null;
	webpackOverride: WebpackOverrideFn;
	poll: number | null;
	getRenderDefaults: () => RenderDefaults;
	getRenderQueue: () => RenderJob[];
	numberOfAudioTags: number;
	queueMethods: QueueMethods;
	parsedCliOpen: boolean;
	previewEntry: string;
	gitSource: GitSource | null;
}) => {
	watchRootFile(remotionRoot);
	const publicDir = getAbsolutePublicDir({
		userPassedPublicDir,
		remotionRoot,
	});
	const hash = crypto.randomBytes(6).toString('hex');

	const outputHashPrefix = '/outputs-';
	const outputHash = `${outputHashPrefix}${hash}`;

	const staticHashPrefix = '/static-';
	const staticHash = `${staticHashPrefix}${hash}`;

	initPublicFolderWatch({
		publicDir,
		remotionRoot,
		onUpdate: () => {
			waitForLiveEventsListener().then((listener) => {
				const files = getFiles();
				listener.sendEventToClient({
					type: 'new-public-folder',
					files,
					folderExists:
						files.length > 0
							? publicDir
							: existsSync(publicDir)
								? publicDir
								: null,
				});
			});
		},
		staticHash,
	});

	// eslint-disable-next-line no-console
	console.log('startStudio', {previewEntry, fullEntryPath, remotionRoot});
	const {port, liveEventsServer} = await startServer({
		entry: path.resolve(previewEntry),
		userDefinedComponent: fullEntryPath,
		getCurrentInputProps,
		getEnvVariables,
		port: desiredPort,
		maxTimelineTracks,
		remotionRoot,
		keyboardShortcutsEnabled,
		publicDir,
		webpackOverride,
		poll,
		userPassedPublicDir,
		staticHash,
		staticHashPrefix,
		outputHash,
		outputHashPrefix,
		logLevel,
		getRenderDefaults,
		getRenderQueue,
		numberOfAudioTags,
		queueMethods,
		gitSource,
		bufferStateDelayInMilliseconds,
	});

	setLiveEventsListener(liveEventsServer);
	const networkAddress = getNetworkAddress();
	if (networkAddress) {
		setServerReadyComment(
			`Local: ${RenderInternals.chalk.underline(
				`http://localhost:${port}`,
			)}, Network: ${RenderInternals.chalk.underline(
				`http://${networkAddress}:${port}`,
			)}`,
		);
	} else {
		setServerReadyComment(`http://localhost:${port}`);
	}

	printServerReadyComment('Server ready', logLevel);

	const {reasonForBrowserDecision, shouldOpenBrowser} = getShouldOpenBrowser({
		configValueShouldOpenBrowser,
		parsedCliOpen,
	});

	if (shouldOpenBrowser) {
		await openBrowser({
			url: `http://localhost:${port}`,
			browserArgs,
			browserFlag,
		});
	} else {
		RenderInternals.Log.verbose(
			{indent: false, logLevel},
			`Not opening browser, reason: ${reasonForBrowserDecision}`,
		);
	}

	await new Promise(noop);
};
