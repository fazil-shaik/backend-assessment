let offer = null;
let leads = [];
let results = [];

exports.setOffer = (data) => (offer = data);
exports.getOffer = () => offer;

exports.setLeads = (data) => (leads = data);
exports.getLeads = () => leads;

exports.setResults = (data) => (results = data);
exports.getResults = () => results;
