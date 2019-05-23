var Masks;
Masks = (function () {
    var fieldsToMask;
    fieldsToMask = [
        {
            'id': 'cpf',
            'maskFn': maskCPF,
        },
        {
            'id': 'telefone',
            'maskFn': maskTelefone,
        },
    ];

    function getRegexGroupsOnly(regex, str) {
        var match = str.match(regex);
        return match.slice(1, match.lenght);
    }

    /**
     * Junta os parâmetros do array com diferentes separadores.
     * Quando a lista de separadores esvaziar, é utilizado um separador padrão.
     * @param {String[]} arr Lista de elementos que irão ser concatenados
     * @param {String[]} [separatorList] Lista de separadores
     * @param {String} [defaultSeparator] Separador default que será utilizado se não houver separadores na lista
     * @returns {String|undefined}
     */
    function joinIfExists(arr, separatorList, defaultSeparator) {
        if(!Array.isArray(arr)) { throw TypeError('arr is not an array'); }
        //Default values to older browsers
        var separators = separatorList && Array.isArray(separatorList) ? separatorList : [''];
        var defSep = defaultSeparator ? defaultSeparator : '';

        return arr.filter(function(elt){
            if(elt) return true;
            return false;
        }).reduce(function(result, elm, i, arr){
            return result + (separators.length ? separators.shift() : defSep) + elm;
        }, '');
    }

    function maskCPF(val) {
        var result = val.replace(/\D/g, '');
        var groups = getRegexGroupsOnly(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, result);
        result = joinIfExists(groups, ['','.','.','-']);
        return result;
    }
    function maskTelefone(val) {
        var result = val.replace(/\D/g, '');
        var groups = getRegexGroupsOnly(/(\d{0,2})(\d{0,4})(\d{0,4})/, result);
        result = joinIfExists(groups, ['(',') ','-']);
        return result;
    }

    function setOnInput() {
        fieldsToMask.forEach(function(field){
            document.getElementById(field.id).addEventListener('input', function(event){
                if(event.target.value){
                    event.target.value = field.maskFn(event.target.value);
                }
            });
        });
    }

    return {
        'setOnInput' : setOnInput,
        'fields' : fieldsToMask,
    };

})();
