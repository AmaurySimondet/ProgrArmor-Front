import { customStyles, customStylesDark, customStylesMini, customStylesDarkMini } from './customStyles';

function styleOnDim(dimensions, user) {
    if (dimensions.width > 500) {
        if (user.modeSombre === true) {
            return customStylesDark;
        } else {
            return customStyles;
        }
    } else {
        if (user.modeSombre === true) {
            return customStylesDarkMini;
        } else {
            return customStylesMini;
        }
    }
}

export { styleOnDim }