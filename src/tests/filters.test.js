import Filter from "../filters"

test('Attribute Name is unquoted', () => {
    const attr = Filter.attr('expected');
    expect(attr.toString()).toEqual('expected');    
})

test('Filters quote string values',()=>{
    const foo = Filter.equals(Filter.attr('attr'), 'value');
    expect(foo.toString()).toEqual('equals(attr,\'value\')');
})

test('Filters quote numeric values',()=>{
    const foo = Filter.equals(Filter.attr('attr'), 1234.5678);
    expect(foo.toString()).toEqual('equals(attr,\'1234.5678\')');
})

test('Filters emit null keyword',()=>{
    const foo = Filter.equals(Filter.attr('attr'), null);
    expect(foo.toString()).toEqual('equals(attr,null)');
})
test('Filters escape inner quotes',()=>{
    const foo = Filter.equals(Filter.attr('attr'), '\'value');
    expect(foo.toString()).toEqual('equals(attr,\'\'\'value\')');
})
test('can pass 3 terms to and',()=>{
    const foo = Filter.and(
        Filter.equals('a','a'),
        Filter.equals('b','b'),
        Filter.equals('c','c'),
    ); 
    expect(foo.toString()).toEqual("and(equals('a','a'),and(equals('b','b'),equals('c','c')))");
})


