import _ from 'lodash';

class Helpers {
  static getTypeImgUrl = type =>
    `https://db.pokemongohub.net/images/badges/thumb/Badge_Type_${type}_01.png`;

  static getGenerationName = gen => {
    switch (gen) {
      case 1:
        return 'Kanto';
      case 2:
        return 'Johto';
      case 3:
        return 'Hoenn';
      case 4:
        return 'Sinnoh';
      case 5:
        return 'Unova';
      case 6:
        return 'Kalos';
      case 7:
        return 'Alola';
      default:
        return 'unknow';
    }
  };

  static toCapitalize = text => text.replace(/^\w/, c => c.toUpperCase());

  static arrayToString = array => {
    let str = '';
    array.forEach((item, index) => {
      str += Helpers.toCapitalize(item);
      if (array.length >= 2 && index === array.length - 2) {
        str += ' and ';
      } else if (index !== array.length - 1) {
        str += ', ';
      }
    });
    return str;
  };

  static getVulnerableTypes = typeCharts => {
    const vulnerableTypes = [];
    typeCharts.forEach(typeChart => {
      if (typeChart.status === 'dis') {
        vulnerableTypes.push(typeChart.type);
      }
    });
    return vulnerableTypes;
  };

  static getBestMoveSet = movesets => _.maxBy(movesets, 'weaveDPS');

  static getVideoURL(pokemon) {
    let { name } = pokemon;
    name = _.replace(name, "'", '');
    if (pokemon.form !== null && pokemon.form !== undefined) {
      name = `${name}_${pokemon.form}`;
    }
    return `https://db.pokemongohub.net/videos/normal/${name}.mp4`;
  }

  static getMaxPokemonId = () => 809;
  
  static getPageSize = () => 8;
}

export default Helpers;
