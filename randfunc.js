var variables = ['x', 'y', 'z', 't', 'u', 'v', 'w', 'r', 's', 'θ'];
var funcs = ['sin', 'cos', 'tan', 'sinh', 'cosh', 'arctan', 'arccos', 'ln'];

// Knuth Shuffle borrowed from https://github.com/coolaj86/knuth-shuffle/
function shuffle(array) {
    var currentIndex = array.length
      , temporaryValue
      , randomIndex
      ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
}

function randInt(a,b){return a+Math.floor(Math.random()*(++b-a))};
function randChoose(arr) return arr[randInt(0, arr.length)];
function randChooseMany(arr, n) return (shuffle(arr)).slice(0, n);

var compose = function () {
    var funcs = arguments;
    
    return function () {
        var args = arguments;
        for (var i = funcs.length; i > 0; --i;) {
            args =[funcs[i].apply(this, args)];
        }
        
        return args[0];

    };
};

var add = function (a, b) { return a + ' + ' +  b };
var multiply = function (a, b) { return '' + a + b };
var divide = function (a, b) { return a + '/' + b };
var exp = function (a, b) { return a + '^' + b };

// literally just puts brackets around a function lol
var ifunc = function (a, b) { return a + '(' + b + ')' };

function 

// generate a random function as a function of a given number of variables
function randterm(n) {
    var term = '';
    var varis = randChooseMany(arr);
    }
}

// build a function with a given number of terms
function randfunc_nterms(n) {
    for (var i=0; i<n; ++i) {
        
    }
}

// generate a set of random functions from the given variable list with a given max dependency depth
function randfunc_set(variables, n) {
    // assoc. array of var -> f(other_vars)
    var funcs = {};

    // consumable variables to build the function set from
    var varqueue = shuffle(variables);

    // dangling references in the dependency tree get pushed here
    var danglingqueue = [];
    

    while (vars.length > 0) {
        // pop a random set of vars off
        var vars = varqueue.splice(0, randInt(1, 3));
        
        // generate a function for each variable)
        for (int i=0; i < vars.length; ++i) {
            var vars2 = varqueue.splice(0, randInt(1, 3));

            for (int i=0; i < vars.length; ++i) {
                funcs[vars[i]] = randfunc(vars2);
            }
    
}

// oh boy
// The function/dependency tree structure

// Node: nodes in the function tree
// children: array of child nodes
// value: value at this level
var Node = function() {
    this.value = '';
    this.func = '';
    
    this.children = [];
};

Node.prototype.hasChildren() = function () {
    return this.children.length > 0;
};

Node.prototype.addChildNode = function (add) {
    this.children.append(add);
};

Node.prototype.getLeaves = function () {
    if (this.children.length > 0) {
        var leaves = [];
        for (var i=0; i < this.children.length; ++i) {
            leaves.append(this.children[i].getLeaves();
        }

        return leaves;
    } else {
        return this;
    }
};

Node.prototype.toString = function () {
    var s = '';
    s + = this.value + ': ' + this.func + '\n';

    for (var i=0; i < this.children.length; ++i)
        s += '-> ' + this.children.toString();
    
};

function FunctionTree = function () {
    this._root = null;
};

FunctionTree.prototype.appendToLeavesWithChance = function (values, chance) {
    if (this._root == null) {
        var node = new Node()
        node.children.append(add);
        
        this._root = node;
    } 
    
    var valueNodes = [];
    for (var i=0; i < values.length; ++i) {
        var n = new Node();
        n.value = values[i];
        valueNodes.append(n);
    }

    var leaves = this._root.getLeaves();
    for (var i=0; i < values.length; ++i) {
        for (var j=0; j < leaves.length; ++j) {
            if (Math.random < chance)
                leaves[j].addChild(valueNodes[i]);
        }
    }
};

FunctionTree.prototype.toString = function () {
    if (this.root != null)
        return this.root.toString();
};

var tree = new FunctionTree()
tree.add('x');
tree.add('y');
tree.add('z');
tree.add('t');
tree.add('u');
