function rndport () {
    return 1024 + Math.floor(Math.random() * 64511);
}

module.exports = rndport;