export default {
    setDefaulted(state, payload) {
        state.defaulted = payload;
    },
    setSelected(state, payload) {
        state.selected = payload;
    },
    setSelectOptions(state, payload) {
        state.selectOptions = payload;
    },
    setDimension(state, payload) {
        state.dimension = payload;
    },
    setCfoMonth(state, payload) {
        state.cfoTime.isMonth = payload;
    }
};