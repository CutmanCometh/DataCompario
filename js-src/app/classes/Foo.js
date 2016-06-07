/**
 * Created by CutmanCometh on 6/7/16.
 */


function Foo(x,y){
    this.x = x;
    this.y = y;
}

Foo.prototype.product = function(){
    return this.x * this.y;
};

Foo.prototype.sum = function(){
    return this.x + this.y;
};