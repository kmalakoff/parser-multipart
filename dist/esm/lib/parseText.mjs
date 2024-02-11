import newlineIterator from 'newline-iterator';
export default function parseText(parser, text) {
    const iterator = newlineIterator(text);
    let next = iterator.next();
    while(!next.done){
        parser.push(next.value);
        next = iterator.next();
    }
    if (!parser.done()) parser.push(null);
};
