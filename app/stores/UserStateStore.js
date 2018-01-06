import _ from '_'
import { action, reaction, observable, observe, computed, autorun } from 'mobx';
import autobind from 'autobind-decorator'

@autobind
class UserStateStore {
	@observable user = {
		userId: '',
		userName: '',
	}

	constructor() {
	}

	@action updateUserState(updateUser) {
		this.user = _.assign(updateUser)
	}
}

// @see https://mobx.js.org/best/store.html
singletonStore = new UserStateStore();
export default singletonStore;
