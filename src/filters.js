
export default class Filter {
    constructor(op, terms) {
        this.op = op;
        this.terms = terms;
    }
    toString() {
        return this.__getParts().join('');
    }

    __getParts(){
        let parts = [this.op];
        let i = 0;
        parts.push('(');
        for (let term of this.terms) {
            if (i > 0) {
                parts.push(',');
            }            
            parts.push(...this.__quoteParts(term));
            i++;
        }
        parts.push(')');
        return parts;
    }
    __quoteParts(value){
        if (value instanceof Filter) {
            return value.__getParts();
        }
        if (value === null || value === undefined) { return ['null']; };
        if (value instanceof Date) {
            value = value.toISOString();
        }
        value = value.toString();
        value = value.replace(/'/g, '\'\'');
        return ['\'' + value + '\''];
    }

    static equals(lhs, rhs) { return new Filter('equals', [lhs, rhs]); }
    static lessThan(lhs, rhs) { return new Filter('lessThan', [lhs, rhs]); }
    static lessOrEqual(lhs, rhs) { return new Filter('lessOrEqual', [lhs, rhs]); }
    static greaterThan(lhs, rhs) { return new Filter('greaterThan', [lhs, rhs]); }
    static greaterOrEqual(lhs, rhs) { return new Filter('greaterOrEqual', [lhs, rhs]); }
    static contains(lhs, rhs) { return new Filter('contains', [lhs, rhs]); }
    static startsWith(lhs, rhs) { return new Filter('startsWith', [lhs, rhs]); }
    static endsWith(lhs, rhs) { return new Filter('endsWith', [lhs, rhs]); }
    static attr(attribute) { return new AttributeFilter(attribute); }
    static or(lhs, rhs) { return new Filter('or', [lhs, rhs]); }
    static and(lhs, rhs) { return new Filter('and', [lhs, rhs]); }
    static any(operand, inList) { return new Filter('any', [operand, ...inList]); }
    static not(term) { return new Filter('not', [term]); }
    static has(rel, filter) {
        if (!(rel instanceof AttributeFilter)) {
            throw new TypeError('the relationship parameter must be an attribute');
        }
        const terms = [rel];
        if (filter) {
            if (!(filter instanceof Filter)) {
                throw new TypeError('the filter parameter must be a filter');
            }
            terms.push(filter);
        }
        return new Filter('has', terms);
    }
    static id(){
        return Filter.attr('Id');
    }

}

class AttributeFilter extends Filter {
    constructor(attributeName) {
        super('', []);
        this.attributeName = attributeName;
    }
    __getParts(){
        return [this.attributeName];
    }
}




