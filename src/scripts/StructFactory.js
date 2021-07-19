export default function StructFactory(names) {
    var argNames = names.split(" ");
    var count = names.length;
    function constructor() {
        for (var i = 0; i < count; i++) {
            this[argNames[i]] = arguments[i];
        }
    }
    return constructor;
}
