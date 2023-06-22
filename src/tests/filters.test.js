import JsonApiDotNetFilter from "../filters"

test('Attribute Name is unquoted', () => {
    const attr = JsonApiDotNetFilter.attr('expected');
    expect(attr.toString()).toEqual('expected');    
})

test('Filters quote string values',()=>{
    const foo = JsonApiDotNetFilter.equals(JsonApiDotNetFilter.attr('attr'), 'value');
    expect(foo.toString()).toEqual('equals(attr,\'value\')');
})

test('Filters quote numeric values',()=>{
    const foo = JsonApiDotNetFilter.equals(JsonApiDotNetFilter.attr('attr'), 1234.5678);
    expect(foo.toString()).toEqual('equals(attr,\'1234.5678\')');
})

test('Filters emit null keyword',()=>{
    const foo = JsonApiDotNetFilter.equals(JsonApiDotNetFilter.attr('attr'), null);
    expect(foo.toString()).toEqual('equals(attr,null)');
})
test('Filters escape inner quotes',()=>{
    const foo = JsonApiDotNetFilter.equals(JsonApiDotNetFilter.attr('attr'), '\'value');
    expect(foo.toString()).toEqual('equals(attr,\'\'\'value\')');
})
test('can pass 3 terms to and',()=>{
    const foo = JsonApiDotNetFilter.and(
        JsonApiDotNetFilter.equals(1,1),
        JsonApiDotNetFilter.equals('b','b'),
        JsonApiDotNetFilter.equals('c','c'),
        JsonApiDotNetFilter.equals('e','f')
    ); 
    expect(foo.toString()).toEqual("and(equals('1','1'),and(equals('b','b'),and(equals('c','c'),equals('e','f'))))");
})


