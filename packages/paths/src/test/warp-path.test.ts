import {expect, test} from 'vitest';
import {warpPath} from '../warp-path';

test('Should be able to warp path', () => {
	expect(
		warpPath('M 0 0 L 0 100', ({x, y}) => ({
			x: x + Math.sin(y / 4) * 5,
			y,
		}))
	).toBe(
		'M 0 0 L 0.970365514464549 0.78125 L 1.9038320449619508 1.5625 L 2.7649037231526368 2.34375 L 3.5208375572726687 3.125 L 4.142888512580358 3.90625 L 4.607402566045721 4.6875 L 4.896716170937308 5.46875 L 4.999827928391245 6.25 L 4.912816925072913 7.03125 L 4.6389918292815775 7.8125 L 4.1887650759902435 8.59375 L 3.5792569250428965 9.375 L 2.8336444485370142 10.15625 L 1.9802802027065005 10.9375 L 1.0516140975653265 11.71875 L 0.08295946114673952 12.5 L -0.8888497801925157 13.28125 L -1.826859743528138 14.0625 L -2.6954017925759493 14.84375 L -3.461448868289758 15.625 L -4.095871371210911 16.40625 L -4.574544839562133 17.1875 L -4.879267302672675 17.96875 L -4.998451426581117 18.75 L -4.927565132383498 19.53125 L -4.669303932434802 20.3125 L -4.23348843117139 21.09375 L -3.6366908881738444 21.875 L -2.901605043731207 22.65625 L -2.0561831698319675 23.4375 L -1.132573160960709 24.21875 L -0.16589608273778408 25 L 0.8070893368327121 25.78125 L 1.7493844896367943 26.5625 L 2.625157791372104 27.34375 L 3.4011072083844276 28.125 L 4.047726596163411 28.90625 L 4.540427695886122 29.6875 L 4.860475124124084 30.46875 L 4.99569880192535 31.25 L 4.940956732542519 32.03125 L 4.698330530285226 32.8125 L 4.277046265344189 33.59375 L 3.693123634530507 34.375 L 2.968766798514854 35.15625 L 2.131520049504873 35.9375 L 1.2132204158241793 36.71875 L 0.24878703150539308 37.5 L -0.7251066938394417 38.28125 L -1.671427612987411 39.0625 L -2.5541910584055962 39.84375 L -3.3398291902092057 40.625 L -3.998467442168012 41.40625 L -4.505060527802941 42.1875 L -4.840344808963141 42.96875 L -4.991570812248588 43.75 L -4.952988038710723 44.53125 L -4.726063631524939 45.3125 L -4.31942658660843 46.09375 L -3.748539627622706 46.875 L -3.0351112225962185 47.65625 L -2.206270100741183 48.4375 L -1.293533659173177 49.21875 L -0.33160948675600344 50 L 0.6429244218407533 50.78125 L 1.5930105758749626 51.5625 L 2.4825211315160853 52.34375 L 3.277631684205266 53.125 L 3.9481074707543513 53.90625 L 4.468453072241857 54.6875 L 4.8188818992636255 55.46875 L 4.986068594026995 56.25 L 4.963655738551176 57.03125 L 4.752495600958368 57.8125 L 4.360617727244791 58.59375 L 3.8029236108824334 59.375 L 3.100620050702746 60.15625 L 2.280412744116503 60.9375 L 1.3734907799817961 61.71875 L 0.41434064665299114 62.5 L -0.5605651464245245 63.28125 L -1.5141549672811254 64.0625 L -2.410167742139434 64.84375 L -3.2145318139578256 65.625 L -3.896660546517933 66.40625 L -4.430615407595479 67.1875 L -4.7960923039756995 67.96875 L -4.97919366207537 68.75 L -4.972956895141175 69.53125 L -4.777619161604328 70.3125 L -4.400608346927072 71.09375 L -3.8562606118641445 71.875 L -3.165275247609673 72.65625 L -2.3539275674317985 73.4375 L -1.45306976526817 74.21875 L -0.49695773449424085 75 L 0.47805154190941496 75.78125 L 1.4348824969306184 76.5625 L 2.337150809875451 77.34375 L 3.150546951481852 78.125 L 3.8441408333030616 78.90625 L 4.391557950945079 79.6875 L 4.771982297299119 80.46875 L 4.970947909130105 81.25 L 4.980888947780822 82.03125 L 4.801427396699442 82.8125 L 4.439387435844302 83.59375 L 3.9085359463668135 84.375 L 3.229059013105301 85.15625 L 2.426794331333073 85.9375 L 1.5322487061548606 86.71875 L 0.5794380049827966 87.5 L -0.3954063251024031 88.28125 L -1.3552149893143026 89.0625 L -2.2634904370038287 89.84375 L -3.0856947124393805 90.625 L -3.7905627903034036 91.40625 L -4.351291455192668 92.1875 L -4.746558516955883 92.96875 L -4.9613336053280985 93.75 L -4.987449712697998 94.53125 L -4.823913751602394 95.3125 L -4.476944317731847 96.09375 L -3.9597352224766382 96.875 L -3.2919537868915727 97.65625 L -2.4989929748834614 98.4375 L -1.6110058039005881 99.21875 L -0.6617587504888651 100'
	);
});