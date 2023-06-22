
class PropertyAccessRecorder {
    attribute = '';
    entity() {
        return new Proxy({}, {
            __parent: this,
            get: function (target, prop, receiver) {
                this.__parent.attribute = prop;
                return null;
            }
        })
    }
}
export default class JsonApiDotNetFilter {
    constructor(op, terms) {
        this.op = op;
        this.terms = terms;
    }
    toString() {
        return this.__getParts().join('');
    }

    __getParts() {
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
    __quoteParts(value) {
        if (value instanceof JsonApiDotNetFilter) {
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

    static equals(lhs, rhs) { return new JsonApiDotNetFilter('equals', [lhs, rhs]); }
    static lessThan(lhs, rhs) { return new JsonApiDotNetFilter('lessThan', [lhs, rhs]); }
    static lessOrEqual(lhs, rhs) { return new JsonApiDotNetFilter('lessOrEqual', [lhs, rhs]); }
    static greaterThan(lhs, rhs) { return new JsonApiDotNetFilter('greaterThan', [lhs, rhs]); }
    static greaterOrEqual(lhs, rhs) { return new JsonApiDotNetFilter('greaterOrEqual', [lhs, rhs]); }
    static contains(lhs, rhs) { return new JsonApiDotNetFilter('contains', [lhs, rhs]); }
    static startsWith(lhs, rhs) { return new JsonApiDotNetFilter('startsWith', [lhs, rhs]); }
    static endsWith(lhs, rhs) { return new JsonApiDotNetFilter('endsWith', [lhs, rhs]); }
    static attr(attribute) {
        if (attribute.constructor.name === "String") {
            return new AttributeFilter(attribute);
        }
        const recorder = new PropertyAccessRecorder();
        attribute(recorder.entity());
        return new AttributeFilter(recorder.attribute);
    }
    static or(lhs, rhs) {
        if (terms.length < 2) {
            throw new RangeError("terms must have 2 or more terms");
        }
        else if (terms.length === 2) {
            return new JsonApiDotNetFilter('or', terms);
        }
        else {
            return JsonApiDotNetFilter.or(terms[0], JsonApiDotNetFilter.or(...terms.slice(1)));
        }
    }
    static and(...terms) {
        if (terms.length < 2) {
            throw new RangeError("terms must have 2 or more terms");
        }
        else if (terms.length === 2) {
            return new JsonApiDotNetFilter('and', terms);
        }
        else {
            return JsonApiDotNetFilter.and(terms[0], JsonApiDotNetFilter.and(...terms.slice(1)));
        }

    }
    static any(operand, inList) { return new JsonApiDotNetFilter('any', [operand, ...inList]); }
    static not(term) { return new JsonApiDotNetFilter('not', [term]); }
    static has(rel, filter) {
        if (!(rel instanceof AttributeFilter)) {
            throw new TypeError('the relationship parameter must be an attribute');
        }
        const terms = [rel];
        if (filter) {
            if (!(filter instanceof JsonApiDotNetFilter)) {
                throw new TypeError('the filter parameter must be a filter');
            }
            terms.push(filter);
        }
        return new JsonApiDotNetFilter('has', terms);
    }
    static id() {
        return JsonApiDotNetFilter.attr('Id');
    }

}

class AttributeFilter extends JsonApiDotNetFilter {
    constructor(attributeName) {
        super('', []);
        this.attributeName = attributeName;
    }
    __getParts() {
        return [this.attributeName];
    }
}




