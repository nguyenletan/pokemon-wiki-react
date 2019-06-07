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
    return `https://db.pokemongohub.net/videos/${name}.mp4`;
  }

  static getGenerationById(id) {
    for (let i = 1; i <= 7; i += 1) {
      if (id < Helpers.getMaxPokeMonIdFofGeneration(i)) {
        return i;
      }
    }
    return 0;
  }

  static getPokemonImgUrl = pokemon => {
    const imgId = () => {
      if (pokemon.id < 10) {
        return `00${pokemon.id}`;
      }
      if (pokemon.id < 100) {
        return `0${pokemon.id}`;
      }
      return `${pokemon.id}`;
    };

    return pokemon.form !== null && pokemon.form !== undefined
      ? `https://db.pokemongohub.net/images/official/full/${imgId()}_f2.png`
      : `https://db.pokemongohub.net/images/official/full/${imgId()}.png`;
  };

  static getPokemonImgUrlWithoutCheckForm = pokemon => {
    const imgId = () => {
      if (pokemon.id < 10) {
        return `00${pokemon.id}`;
      }
      if (pokemon.id < 100) {
        return `0${pokemon.id}`;
      }
      return `${pokemon.id}`;
    };

    return `https://db.pokemongohub.net/images/official/full/${imgId()}.png`;
  };

  static getFormImgUrl = (pokemonId, formValue) => {
    const imgId = () => {
      if (pokemonId < 10) {
        return `00${pokemonId}`;
      }
      if (pokemonId < 100) {
        return `0${pokemonId}`;
      }
      return `${pokemonId}`;
    };

    return formValue !== ''
      ? `https://db.pokemongohub.net/images/official/full/${imgId()}_f2.png`
      : `https://db.pokemongohub.net/images/official/full/${imgId()}.png`;
  };

  static normalizePokemon = pokemon => {
    // normalize family
    const { family } = pokemon;
    if (family !== null) {
      for (let i = 0; i < family.length; i += 1) {
        if (family[i].id !== family[i].index) {
          family[i].id = family[i].index || family[i].id;
        }
      }
    }
    return pokemon;
  };

  static normalizePokemon2 = pokemon => {
    // normalize family
    // normalize family
    const poke = pokemon;
    if (pokemon.id !== pokemon.index) {
      poke.id = pokemon.index || pokemon.id;
    }
    return poke;
  };

  static getPokeName = pokemon => {
    const { name, form } = pokemon;

    return form !== null && form !== undefined && form !== ''
      ? `${name} ${form}`
      : name;
  };

  static getMaxPokemonId = () => 809;

  static getMaxPokeMonIdFofGeneration(generation) {
    switch (generation) {
      case 1:
        return 151;
      case 2:
        return 251;
      case 3:
        return 386;
      case 4:
        return 493;
      case 5:
        return 649;
      case 6:
        return 721;
      case 7:
        return 809;
      default:
        return 0;
    }
  }

  static romanize(num) {
    const digits = String(+num).split('');

    const key = [
      '',
      'C',
      'CC',
      'CCC',
      'CD',
      'D',
      'DC',
      'DCC',
      'DCCC',
      'CM',
      '',
      'X',
      'XX',
      'XXX',
      'XL',
      'L',
      'LX',
      'LXX',
      'LXXX',
      'XC',
      '',
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX'
    ];

    let roman = '';

    let i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman;
    return Array(+digits.join('') + 1).join('M') + roman;
  }

  static getPageSize = () => 16;
  
}

export default Helpers;
