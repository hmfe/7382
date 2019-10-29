// Operations with localStorage must always be wrapped in try/catch:
// user might have disabled LocalStorage
// or they might be using really old or mini mobile browser
// or document origin is not a scheme/host/port tuple.

// LocalStorage also might be full.

class LocalStorageDriver {
    constructor(name) {
        if (!name || typeof name !== 'string') {
            this.error = new Error('Missing param "name"');
        } else {
            this.name = name;
        }
    }

    getItem() {
        if (!this.name) return this.error;

        try {
            return JSON.parse(localStorage.getItem(this.name));
        } catch (err) {
            return err;
        }
    }

    setItem(data) {
        if (!this.name) return this.error;
        if (!data) return this.removeItem();

        try {
            localStorage.setItem(this.name, JSON.stringify(data));
        } catch (err) {
            return err;
        }

        return true;
    }

    removeItem() {
        if (!this.name) return this.error;

        try {
            localStorage.removeItem(this.name);
        } catch (err) {
            return err;
        }

        return true;
    }
}

export default LocalStorageDriver;
