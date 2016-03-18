var variables = ['x', 'y', 'z', 't', 'u', 'v', 'w', 'r', 's'];
var funcs = ['sin', 'cos', 'tan', 'sinh', 'cosh', 'arctan', 'arccos', 'ln'];
var operators = ['+', '-', '*', '/', '^'];

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
function randChoose(arr) {return arr[randInt(0, arr.length-1)]};
function randChooseMany(arr, n) {return (shuffle(arr)).slice(0, n)};

// oh boy
// Expression Tree structure
var OpNode = function() {
    this.operator;

    this.left;
    this.right;

    if (arguments[0]) this.operator = arguments[0];
    if (arguments[1]) this.left = arguments[1];
    if (arguments[2]) this.right = arguments[2];
}

OpNode.prototype.toString = function() {
    return '(' + this.left + this.operator +  this.right + ')';
}

OpNode.prototype.setOperands = function(left, right) {
    this.left = left;
    this.right = right;
}

var ComposeOpNode = function() {
    this.operator = 'COMPOSE';
    
    this.left = null;
    this.func;
    this.right;
    
    if (arguments[0]) this.func = arguments[0];
    if (arguments[1]) this.right = arguments[1];
}

ComposeOpNode.prototype.setOperands = function(left, right) {
    this.func = left;
    this.right = right;
}

ComposeOpNode.prototype.toString = function() {
    return this.func + '(' + this.right + ')';
}

// Generates a random expression tree using the specified variables
var randExpr = function(vars) {
    var exprqueue = [];
   
    exprqueue.push(randVarConst(vars));
    exprqueue.push(randVarConst(vars));
    exprqueue.push(new OpNode(randChoose(operators), exprqueue.pop(), exprqueue.pop()));
    
    for (var i=0; i < randInt(1, 5); ++i) {
        switch(randInt(0, 1)) {
            case 0: // arithmetic operation
                exprqueue.push(randVarConst(vars));
                exprqueue.push(randVarConst(vars));
                exprqueue.push(new OpNode(randChoose(operators), exprqueue.pop(), exprqueue.pop()));
                break;
            case 1: // function composition
                exprqueue.push(new ComposeOpNode(randChoose(funcs), exprqueue.pop()));
                break;
        }
    }

    while (exprqueue.length > 1) {
        exprqueue.push(new OpNode(randChoose(operators), exprqueue.pop(), exprqueue.pop()));
    }

    return exprqueue[0].toString();
}

var randVarConst = function(vars) {
    if (Math.random() < 0.2) {
        return randInt(0, 16);
    }
    return randChoose(vars);
}


// Generates a random expression node with the given vars and pushes it to the specified tree
var randExprNode = function(tree, vars) {
    switch(randInt(0, 1)) {
        case 0: // arithmetic operation
            tree.addOperand(randVarConst(vars));
            tree.addOperand(randVarConst(vars));
            tree.addOperator(new OpNode(randChoose(operators)));
            break;
        case 1: // function composition
            tree.addOperand(randChoose(funcs));
            tree.addOperator(new ComposeOpNode());
            break;
    }
}

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
// FIXME: sometimes a node (value) will be missed and never added to the tree since it's random
Node.prototype.appendToLeavesWithChance = function (nodes, chance, visited) {
    if (visited.indexOf(this) != -1) {
        // already visited this node
        return;
    }

    visited.push(this);
    if (this.children.length == 0) {
        // found an unvisited leaf node
        for (var i=0; i < nodes.length; ++i) {
            if (Math.random() < chance) {
                this.children.push(nodes[i]);
            }
        }
    } else { 
        // keep looking
        for (var i=0; i < this.children.length; ++i) {
            this.children[i].appendToLeavesWithChance(nodes, chance, visited);
        }
    }
};

Node.prototype.constructFunctions = function (visited) {
    if (visited.indexOf(this) != -1) {
        // already visited this node 
        return;
    }

    visited.push(this);
    var cvars = [];
    for (var i=0; i < this.children.length; ++i) {
        cvars.push(this.children[i].value);
        
        // recurse for each child
        this.children[i].constructFunctions(visited);
    }

    // skip leaf nodes
    if (this.hasChildren()) this.func = randExpr(cvars);
}

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
            this._root.value += ', ';
        }

        this._root.value += values[i];
    }

    this._root.value += ')';
}

FunctionTree.prototype.constructFunctions = function () {
    this._root.constructFunctions([]);
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

    tree.constructFunctions();

    console.log(tree);
};

main();
