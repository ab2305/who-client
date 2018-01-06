import { action, reaction, observable, observe, computed, autorun } from 'mobx';
import autobind from 'autobind-decorator'

@autobind
class UiStateStore {
	@observable dialogVisible = false

	constructor() {
	}

	@action onDialogPress() {
	}

	@action onDialogOpen() {
		this.dialogVisible = true;
	}

	@action onDialogClose() {
		this.dialogVisible = false;
	}
}

// @see https://mobx.js.org/best/store.html
singletonStore = new UiStateStore();
export default singletonStore;
