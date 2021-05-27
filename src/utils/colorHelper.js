export const validColorCheck = (colorStr) => {
    if (colorStr !== null && colorStr.length === 7) {
        const pattern = /\b#[0-f][0-f][0-f][0-f][0-f][0-f]\b/
        if (colorStr.match(pattern) !== null) {
            return true
        }
    }
    return false
}