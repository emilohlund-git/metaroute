export const KNOWN_IP_HEADERS = [
  "fastly-client-ip",
  "cf-connecting-ip",
  "true-client-ip",
  "x-real-ip",
  "x-cluster-client-ip",
  "x-forwarded",
  "forwarded-for",
  "x-appengine-user-ip",
  "Cf-Pseudo-IPv4",
];

export const X_FORWARDED_FOR = "x-forwarded-for";

export const IP_REGEX = {
  v4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
  v6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
};

export const CONTROLLER_WATERMARK = Symbol("___controller___");
export const METHOD_WATERMARK = Symbol("___method___");
