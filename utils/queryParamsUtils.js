/**
 * Transforme une chaine de caractères en boolean
 * @param  {[String]} str le paramètre d'url
 * @return {[Boolean]} le résultat si la chaine représente un booléan, null sinon
 */
function stringToBoolean(str) {
  if (!str) {
    return null;
  }
  return str.toLowerCase() === 'true' ? true : false;
}

/**
 * S'assure qu'un paramètre d'url multiple soit bien un tableau
 * @param  {[Any]} value le paramètre d'url
 * @return {[Array]} le paramètre d'url si c'est un tableau, un tableau contenant l'unique valeur ou null
 */
function enforceArray(value) {
  //Si pas value -> null
  if (!value) {
    return null;
  }
  //Si value est une chaine : tableau contenant cette chaine
  if (typeof(value) === 'string') {
    return [value];
  }
  //Si value est un tableau : on ne touche à rien
  return value;
}

module.exports = {
  stringToBoolean,
  enforceArray,
};
