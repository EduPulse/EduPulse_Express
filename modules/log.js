const Log = require('../models/log');

const save = (option, verbose) => {
    const log = new Log({v: `[${option}] ${verbose}`});
    log.save()
    .then(() => {console.log(log.v);})
    .catch(() => {console.log(`FAILED LOGGING: ${log.v}`);});
};

const info = (verbose) => {
    save('INFO', verbose);
};

const sys = (verbose) => {
    save('SYS', verbose);
};

const warn = (verbose) => {
    save('WARN', verbose);
};

const error = (verbose) => {
    save('ERROR', verbose);
};

module.exports = {
    info,
    warn,
    error,
    sys
}