var variables = ['x', 'y', 'z', 't', 'u', 'v', 'w', 'r', 's', 'θ'];
var funcs = ['sin', 'cos', 'tan', 'sinh', 'cosh', 'arctan', 'arccos', 'ln'];

// Knuth Shuffle borrowed from https://github.com/coolaj86/knuth-shuffle/
shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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
function randChoose(arr) {return arr[randInt(0, arr.length)]};
function randChooseMany(arr, n) {return (shuffle(arr)).slice(0, n)};

var compose = function () {
    var funcs = arguments;
    
    return function () {
        var args = arguments;
        for (var i = funcs.length; i > 0; --i) {
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

// generate a random function as a function of a given number of variables
var randterm = function(n) {
    var term = '';
    var varis = randChooseMany(arr);
};

// build a function with a given number of terms
var randfunc_nterms = function(n) {
    for (var i=0; i<n; ++i) {
        
    }
};

// generate a set of random functions from the given variable list with a given max dependency depth
var randfunc_set = function(variables, n) {
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
        for (var i=0; i < vars.length; ++i) {
            var vars2 = varqueue.splice(0, randInt(1, 3));

            for (var i=0; i < vars.length; ++i) {
                funcs[vars[i]] = randfunc(vars2);
            }
        }
    }
};

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

Node.prototype.hasChildren = function () {
    return this.children.length > 0;
};

Node.prototype.append = function (add) {
    this.children.push(add);
};

Node.prototype.concat = function (add) {
    this.children = this.children.concat(add);
};

// Appends each node from a given array to a leaf node recursively with a given chance
Node.prototype.appendToLeavesWithChance = function (nodes, chance, visited) {
    if (visited.indexOf(this) != -1) {
        // already visited this node
        return;
    }

    if (this.children.length == 0) {
        // found an unvisited leaf node
        visited.push(this);

        for (var i=0; i < nodes.length; ++i) {
            if (Math.random() < chance) {
                // sometimes a node gets appended to itself??? 
                this.children.push(nodes[i]);
            }
        }
    } else { // FIXME: check for nodes NOT children of this node already, maybe make a shallow copy of children and then do it? Is this.children updating when we append?
        // keep looking
        var chi = this.children.slice();
        for (var i=0; i < chi.length; ++i) {
            chi[i].appendToLeavesWithChance(nodes, chance, visited);
        }
    }
};

Node.prototype.getLeaves = function () {
    if (this.children.length > 0) {
        var leaves = [];
        for (var i=0; i < this.children.length; ++i) {
            leaves.concat(this.children[i].getLeaves());
        }

        return leaves;
    } else {
        return [this];
    }
};

Node.prototype.toTreeString = function (depth) {
    var s = '';
    for (var i=0; i < depth; ++i) {
        s += '    ';
    }

    s += this.value + ': ' + this.func + '\n';

    for (var i=0; i < this.children.length; ++i)
        s += this.children[i].toTreeString(depth + 1);
   
   return s;
};

var FunctionTree = function () {
    // the root node is always initialized, it serves as our F(x,y,z,...)
    this._root = new Node();
};

FunctionTree.prototype.setVarNames = function (values) {
    this._root.value = "f(";
    for (var i=0; i < values.length; ++i) {
        if (i > 0) {
            this._root.value += ' ,';
        }

        this._root.value += values[i];
    }

    this._root.value += ')';
}

FunctionTree.prototype.appendToLeavesWithChance = function (values, chance) {
    var valueNodes = [];
    for (var i=0; i < values.length; ++i) {
        var n = new Node();
        n.value = values[i];
        valueNodes.push(n);
    }
    
    this._root.appendToLeavesWithChance(valueNodes, chance, []);
};

FunctionTree.prototype.toString = function () {
    return this._root.toTreeString(0);
};

var tree, avars, lvars;
var main = function() {
    tree = new FunctionTree();
    avars = shuffle(variables);
    tree.setVarNames(avars);

    while(avars.length > 0) {
        lvars = avars.splice(0, randInt(1, 3));
        tree.appendToLeavesWithChance(lvars, Math.random() * 0.5 + 0.5);
    }

    console.log(tree);
};

main();
