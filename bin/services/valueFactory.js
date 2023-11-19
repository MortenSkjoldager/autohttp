function getValueFromType(type) {
    if (type == 'string') {
        return "value";
    }

    if (type == 'integer') {
        return 4;
    }

    return '0';
}

module.exports = { getValueFromType }
