
import { PropertyAccessRecorder } from "./functions";
function isWhenThenOtherwise(x) { return x && x.constructor.name === "Object" && (x.when !== undefined && (x.then !== undefined || x.otherwise !== undefined)); }
function unpackWhenThenOtherwise(terms) {
    return terms.map(t => {
        if (!t) { return undefined; }
        if (t instanceof JsonApiDotNetFilter) { return t; }
        const condition = t.when !== undefined && t.when.constructor.name === 'Function' ? (() => t.when()) : (() => t.when);
        const then = t.then !== undefined && t.then.constructor.name === 'Function' ? (() => t.then()) : (() => t.then);
        const otherwise = t.otherwise !== undefined && t.otherwise.constructor.name === 'Function' ? (() => t.otherwise()) : (() => t.otherwise);
        return condition() ? then() : otherwise();
    }).filter(x => x !== undefined);
}
export class JsonApiDotNetFilter {
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
        if (value === null) { return ['null']; };
        if (value === undefined) { return []; }
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
            return new JsonApiDotNetAttributeFilter(attribute);
        }
        const recorder = new PropertyAccessRecorder();
        attribute(recorder.entity());
        return new JsonApiDotNetAttributeFilter(recorder.attribute);
    }
    static or(...terms) {
        const isWhenThen = terms.some(t => isWhenThenOtherwise(t));
        if (isWhenThen) {
            terms = unpackWhenThenOtherwise(terms);
            if (terms.length === 0) {
                return JsonApiDotNetFilter.equals('1', '1');
            }
            if (terms.length === 1) {
                return terms[0];
            }
            return JsonApiDotNetFilter.or(...terms);
        }
        else {
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
    }
    static and(...terms) {
        const isWhenThen = terms.some(t => isWhenThenOtherwise(t));
        if (isWhenThen) {
            terms = unpackWhenThenOtherwise(terms);
            if (terms.length === 0) {
                return JsonApiDotNetFilter.equals('1', '1');
            }
            if (terms.length === 1) {
                return terms[0];
            }
            return JsonApiDotNetFilter.and(...terms);
        }
        else {
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

    }


    static any(operand, inList) {
        return new JsonApiDotNetFilter('any', [operand, ...(inList || [])]);
    }
    static not(term) { return new JsonApiDotNetFilter('not', [term]); }
    static has(rel, filter) {
        if (!(rel instanceof JsonApiDotNetAttributeFilter)) {
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
        return JsonApiDotNetFilter.attr('id');
    }

}

class JsonApiDotNetAttributeFilter extends JsonApiDotNetFilter {
    constructor(attributeName) {
        super('', []);
        this.attributeName = attributeName;
    }
    __getParts() {
        return [this.attributeName];
    }
}




