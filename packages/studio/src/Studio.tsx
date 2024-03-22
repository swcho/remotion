import React, {useLayoutEffect} from 'react';
import {createPortal} from 'react-dom';
import {Internals} from 'remotion';
import '../styles.css';
import {Editor} from './components/Editor';
import {EditorContexts} from './components/EditorContexts';
import {ServerDisconnected} from './components/Notifications/ServerDisconnected';

const getServerDisconnectedDomElement = () => {
	return document.getElementById('server-disconnected-overlay');
};

export const Studio: React.FC<{
	rootComponent: React.FC;
	readOnly: boolean;
}> = ({rootComponent, readOnly}) => {
	useLayoutEffect(() => {
		window.remotion_isStudio = true;
		Internals.enableSequenceStackTraces();
	}, []);
	// eslint-disable-next-line no-console
	console.log('Studio', {rootComponent});
	return (
		<Internals.RemotionRoot
			numberOfAudioTags={window.remotion_numberOfAudioTags}
		>
			<EditorContexts readOnlyStudio={readOnly}>
				<Editor readOnlyStudio={readOnly} Root={rootComponent} />
				{readOnly
					? null
					: createPortal(
							<ServerDisconnected />,
							getServerDisconnectedDomElement() as HTMLElement,
						)}
			</EditorContexts>
		</Internals.RemotionRoot>
	);
};
