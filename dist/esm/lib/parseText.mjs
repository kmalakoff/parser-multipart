import newlineIterator from "newline-iterator";
export default function parseText(parser, text) {
    var iterator = newlineIterator(text);
    var next = iterator.next();
    while(!next.done){
        parser.push(next.value);
        next = iterator.next();
    }
    if (!parser.done()) parser.push(null);
};
