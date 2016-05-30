'use strict';

/* Directives */


var directivesRuby = angular.module('ruby.directives', []);

directivesRuby.directive('ttlInput', function() {
    return {
        templateUrl: '/assets/template/ttl-input.html',
        restrict: 'E',
        scope: {
            model: '='
        },
        link: function($scope) {
            var listener = $scope.$watch('model', function(newValue, oldValue) {
                $scope.model = parseInt($scope.model);
                $scope.day = Math.floor($scope.model / 86400) || 0;
                var mod = $scope.model % 86400;
                $scope.hour = Math.floor(mod / 3600) || 0;
                mod = mod % 3600;
                $scope.min = Math.floor(mod / 60) || 0;
                $scope.sec = Math.floor(mod % 60) || 0;
            });
            $scope.changeValue = function(modelName, increase) {
                listener();
                var value = parseInt($scope[modelName]);
                if (increase) {
                    value++;
                } else if (value > 0) {
                    value--;
                }
                $scope[modelName] = value;
                $scope.model = parseInt($scope.day) * 86400 + parseInt($scope.hour) * 3600 + parseInt($scope.min) * 60 + parseInt($scope.sec);
            };
            $scope.valueChange = function() {
                listener();
                $scope.model = parseInt($scope.day) * 86400 + parseInt($scope.hour) * 3600 + parseInt($scope.min) * 60 + parseInt($scope.sec);
            };
        }
    };
});

directivesRuby.directive('passwordStrengthBar', function() {
    return {
        replace: true,
        restrict: 'E',
        template: '<div id="strength">' +
        '<ul id="strengthBar">' +
        '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>' +
        '</ul>' +
        '</div>',
        link: function(scope, iElement, attr) {
            var strength = {
                colors: ['#E74C3C', '#E67E22', '#F1C40F', '#1ABC9C', '#2ECC71'],
                mesureStrength: function (p) {

                    var _force = 0;
                    var _regex = /[$-/:-?{-~!"^_`\[\]]/g; // "

                    var _lowerLetters = /[a-z]+/.test(p);
                    var _upperLetters = /[A-Z]+/.test(p);
                    var _numbers = /[0-9]+/.test(p);
                    var _symbols = _regex.test(p);

                    var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
                    var _passedMatches = $.grep(_flags, function (el) { return el === true; }).length;

                    _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
                    _force += _passedMatches * 10;

                    // penality (short password)
                    _force = (p.length <= 6) ? Math.min(_force, 10) : _force;

                    // penality (poor variety of characters)
                    _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
                    _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
                    _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;

                    return _force;

                },
                getColor: function (s) {

                    var idx = 0;
                    if (s <= 10) { idx = 0; }
                    else if (s <= 20) { idx = 1; }
                    else if (s <= 30) { idx = 2; }
                    else if (s <= 40) { idx = 3; }
                    else { idx = 4; }

                    return { idx: idx + 1, col: this.colors[idx] };
                }
            };
            scope.$watch(attr.passwordToCheck, function(password) {
                if (password && password !== "") {
                    var c = strength.getColor(strength.mesureStrength(password));
                    iElement.removeClass('ng-hide');
                    iElement.find('ul').children('li')
                        .css({ "background": "#DDD" })
                        .slice(0, c.idx)
                        .css({ "background": c.col });
                } else {
                    iElement.addClass('ng-hide');
                }
            });
        }
    }
});

directivesRuby.directive('formAutoFillFix', function() {
    return function(scope, elem, attrs) {
        // Fixes Chrome bug: https://groups.google.com/forum/#!topic/angular/6NlucSskQjY
        elem.prop('method', 'POST');

        // Fix autofill issues where Angular doesn't know about autofilled inputs
        if(attrs.ngSubmit) {
            setTimeout(function() {
                elem.unbind('submit').bind('submit', function(e) {
                    e.preventDefault();
                    elem.find('input').triggerHandler('change');
                    scope.$apply(attrs.ngSubmit);
                });
            }, 0);
        }
    };
});

directivesRuby.directive('passwordMatch', [function () {
    return {
        restrict: 'A',
        scope:true,
        require: 'ngModel',
        link: function (scope, elem , attrs, control) {
            var checker = function () {

                //get the value of the first password
                var e1 = scope.$eval(attrs.ngModel);

                //get the value of the other password
                var e2 = scope.$eval(attrs.passwordMatch);
                return e1 == e2;
            };
            scope.$watch(checker, function (n) {
                //set the form control to valid if both
                //passwords are the same, else invalid
                control.$setValidity("match", n);
            });
        }
    };
}]);

directivesRuby.directive('validateEmailTemplate', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            language: '='
        },
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(attrs.ngModel, function (v) {
                console.log(scope.language);
                if (v) {
                    scope.language.isEnabled = true;
                }
                console.log(scope.language);
                console.log('value changed, new value is: ' + v);
            });
        }
    };
});

directivesRuby.directive("tokenPopover", function($popover) {
    return {
        restrict: "A",
        scope: {tokenPopover: '='},
        link: function(scope, element, attrs) {
            scope.tokenPopover.scope = scope;
            var popover = $popover(element, scope.tokenPopover);
            scope.$on('$destroy', function() {
                popover.destroy();
                popover = null;
            });
        }
    };
});

directivesRuby.directive("ngScopeElement", function () {
    var directiveDefinitionObject = {

        restrict: "A",

        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                    scope[iAttrs.ngScopeElement] = iElement;
                }
            };
        }
    };

    return directiveDefinitionObject;
});
//TODO A revoir la double directive, je dois livrer
directivesRuby.directive('bootstrapTagsinputObject', ['$compile', function($compile) {

    function getItemProperty(scope, property) {
        if (!property)
            return undefined;

        if (angular.isFunction(scope.$parent[property]))
            return scope.$parent[property];

        return function(item) {
            return item[property];
        };
    }

    return {
        restrict: 'EA',
        scope: {
            model: '=ngModel'
        },
        template: '<select multiple></select><div class="bootstrap-tagsinput" ng-scope-element="container"><input size="26" type="text" placeholder="Add role then press Enter" ng-model="tagsInput" typeahead="type as type.role for type in typeaheadArray() | filter:{role:$viewValue} | limitTo:8" ng-scope-element="input"></div>',
        link: function(scope, element, attrs) {
            $(function() {
                scope.typeaheadArray = angular.isDefined(scope.$parent[attrs.typeaheadArray]) ? scope.$parent[attrs.typeaheadArray] : [];
                scope.tagsInput = {role: ''};
                scope.input.bind("keydown keypress", function (event) {
                    if(event.which === 13) {
                        scope.$apply(function (){
                            if (angular.isObject(scope.tagsInput)) {
                                console.log(scope.tagsInput);
                                select.tagsinput('add', scope.tagsInput);
                                scope.input.val('');
                            }
                        });

                        event.preventDefault();
                    }
                });
                if (!angular.isArray(scope.model))
                    scope.model = [];

                var select = $('select', element);
                if (attrs.placeholder) {
                    select.attr('placeholder', attrs.placeholder);
                }

                select.tagsinput({
                    typeahead : {
                        source   : angular.isFunction(scope.$parent[attrs.typeaheadSource]) ? scope.$parent[attrs.typeaheadSource] : null
                    },
                    itemValue: getItemProperty(scope, attrs.itemvalue),
                    itemText : getItemProperty(scope, attrs.itemtext),
                    tagClass : angular.isFunction(scope.$parent[attrs.tagclass]) ? scope.$parent[attrs.tagclass] : function(item) { return attrs.tagclass; },
                    container: scope.container,
                    input: scope.input
                });

                for (var i = 0; i < scope.model.length; i++) {
                    select.tagsinput('add', scope.model[i]);
                }

                select.on('itemAdded', function(event) {
                    if (scope.model.indexOf(event.item) === -1)
                        scope.model.push(event.item);
                });

                select.on('itemRemoved', function(event) {
                    var idx = scope.model.indexOf(event.item);
                    if (idx !== -1)
                        scope.model.splice(idx, 1);
                });

                // create a shallow copy of model's current state, needed to determine
                // diff when model changes
                var prev = scope.model.slice();
                scope.$watch("model", function() {
                    var added = scope.model.filter(function(i) {return prev.indexOf(i) === -1;}),
                        removed = prev.filter(function(i) {return scope.model.indexOf(i) === -1;}),
                        i;

                    prev = scope.model.slice();

                    // Remove tags no longer in binded model
                    for (i = 0; i < removed.length; i++) {
                        select.tagsinput('remove', removed[i]);
                    }

                    // Refresh remaining tags
                    select.tagsinput('refresh');

                    // Add new items in model as tags
                    for (i = 0; i < added.length; i++) {
                        select.tagsinput('add', added[i]);
                    }
                }, true);
            });
        }
    };
}]);

//<input size="26" type="text" placeholder="Add email then press Enter" ng-model="tagsInput" typeahead="email for email in emails | filter:$viewValue | limitTo:8">
directivesRuby.directive('bootstrapTagsinput', ['$compile', function($compile) {

    function getItemProperty(scope, property) {
        if (!property)
            return undefined;

        if (angular.isFunction(scope.$parent[property]))
            return scope.$parent[property];

        return function(item) {
            return item[property];
        };
    }

    return {
        restrict: 'EA',
        scope: {
            model: '=ngModel'
        },
        template: '<select multiple></select><div class="bootstrap-tagsinput" ng-scope-element="container"><input size="26" type="text" placeholder="Add email then press Enter" ng-model="tagsInput" typeahead="type for type in typeaheadArray() | filter:$viewValue | limitTo:8" ng-scope-element="input"></div>',
        link: function(scope, element, attrs) {
            $(function() {
                scope.typeaheadArray = angular.isDefined(scope.$parent[attrs.typeaheadArray]) ? scope.$parent[attrs.typeaheadArray] : [];
                scope.tagsInput = '';
                if (angular.isDefined(attrs.isObject)) {
                    element.replaceWith($compile('<select multiple></select><div class="bootstrap-tagsinput" ng-scope-element="container"><input size="26" type="text" placeholder="Add email then press Enter" ng-model="tagsInput" typeahead="type as type.role for type in typeaheadArray() | filter:$viewValue | limitTo:8" ng-scope-element="input"></div>')(scope));
                    scope.input.bind("keydown keypress", function (event) {
                        if(event.which === 13) {
                            scope.$apply(function (){
                                select.tagsinput('add', scope.tagsInput);
                            });

                            event.preventDefault();
                        }
                    });
                }
                if (!angular.isArray(scope.model))
                    scope.model = [];

                var select = $('select', element);
                if (attrs.placeholder) {
                    select.attr('placeholder', attrs.placeholder);
                }

                select.tagsinput(scope.$parent[attrs.options || ''] || {
                        typeahead : {
                            source   : angular.isFunction(scope.$parent[attrs.typeaheadSource]) ? scope.$parent[attrs.typeaheadSource] : null
                        },
                        itemValue: getItemProperty(scope, attrs.itemvalue),
                        itemText : getItemProperty(scope, attrs.itemtext),
                        tagClass : angular.isFunction(scope.$parent[attrs.tagclass]) ? scope.$parent[attrs.tagclass] : function(item) { return attrs.tagclass; },
                        container: scope.container,
                        input: scope.input,
                        isEmail: true
                    });

                for (var i = 0; i < scope.model.length; i++) {
                    select.tagsinput('add', scope.model[i]);
                }

                select.on('itemAdded', function(event) {
                    if (scope.model.indexOf(event.item) === -1)
                        scope.model.push(event.item);
                });

                select.on('itemRemoved', function(event) {
                    var idx = scope.model.indexOf(event.item);
                    if (idx !== -1)
                        scope.model.splice(idx, 1);
                });

                // create a shallow copy of model's current state, needed to determine
                // diff when model changes
                var prev = scope.model.slice();
                scope.$watch("model", function() {
                    var added = scope.model.filter(function(i) {return prev.indexOf(i) === -1;}),
                        removed = prev.filter(function(i) {return scope.model.indexOf(i) === -1;}),
                        i;

                    prev = scope.model.slice();

                    // Remove tags no longer in binded model
                    for (i = 0; i < removed.length; i++) {
                        select.tagsinput('remove', removed[i]);
                    }

                    // Refresh remaining tags
                    select.tagsinput('refresh');

                    // Add new items in model as tags
                    for (i = 0; i < added.length; i++) {
                        select.tagsinput('add', added[i]);
                    }
                }, true);
            });
        }
    };
}]);

directivesRuby.directive('validateTemplate', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            var validate = function(email, name, object, template, mandatoryTokens) {
                if ((email == undefined || email == null || email === "")
                    && (name == undefined || name == null || name === "")
                    && (object == undefined || object == null || object === "")
                    && (template === undefined || template === null || template === "")) {
                    return null;
                }
                if (email == undefined || email == null || email === "") {
                    return false;
                }
                if (name == undefined || name == null || name === "") {
                    return false;
                }
                if (object == undefined || object == null || object === "") {
                    return false;
                }
                var containsAll = function(str, substrings) {
                    for (var i = 0; i != substrings.length; ++i) {
                        if (!new RegExp(substrings[i]).test(str)) {
                            return false;
                        }
                    }
                    return true;
                };
                if (template === undefined || template === null || template === "" || !containsAll(template, mandatoryTokens)) {
                    return false;
                }
                return true;
            };

            //console.log(scope.language);
            scope.$watchCollection('language', function (v) {
                var l = scope.language;
                l.forgotErrors = null;
                l.forgotErrorsMister = null;
                l.forgotErrorsMiss = null;
                l.welcomeErrors = null;
                l.welcomeErrorsMister = null;
                l.welcomeErrorsMiss = null;
                l.activationErrors = null;
                l.activationErrorsMister = null;
                l.activationErrorsMiss = null;
                l.isEnabled = l.languageCode == 'EN' || l.activationEmail || l.activationEmailName || l.activationEmailObject || l.activationEmailTemplate
                    || l.welcomeEmail || l.welcomeEmailName || l.welcomeEmailObject || l.welcomeEmailTemplate
                    || l.forgotPasswordEmail || l.forgotPasswordEmailName || l.forgotPasswordEmailObject || l.forgotPasswordEmailTemplate;
                if (l.isEnabled) {
                    l.isValid = true;
                    if (!scope.application.accountAutoActivated && (l.activationErrors = !validate(l.activationEmail, l.activationEmailName, l.activationEmailObject, l.activationEmailTemplate, ['%LINK%|%TOKEN%']))) {
                        l.isValid = false;
                    }
                    if (!scope.application.accountAutoActivated && (l.activationErrorsMister = !validate(l.activationEmail, l.activationEmailName, l.activationEmailObject, l.activationEmailTemplateMister, ['%LINK%|%TOKEN%']))) {
                        l.isValid = false;
                    }
                    if (!scope.application.accountAutoActivated && (l.activationErrorsMiss = !validate(l.activationEmail, l.activationEmailName, l.activationEmailObject, l.activationEmailTemplateMiss, ['%LINK%|%TOKEN%']))) {
                        l.isValid = false;
                    }
                    if (l.welcomeErrors = !validate(l.welcomeEmail, l.welcomeEmailName, l.welcomeEmailObject, l.welcomeEmailTemplate, [])) {
                        l.isValid = false;
                    }
                    if (l.welcomeErrorsMister = !validate(l.welcomeEmail, l.welcomeEmailName, l.welcomeEmailObject, l.welcomeEmailTemplateMister, [])) {
                        l.isValid = false;
                    }
                    if (l.welcomeErrorsMiss = !validate(l.welcomeEmail, l.welcomeEmailName, l.welcomeEmailObject, l.welcomeEmailTemplateMiss, [])) {
                        l.isValid = false;
                    }
                    if (l.forgotErrors = !validate(l.forgotPasswordEmail, l.forgotPasswordEmailName, l.forgotPasswordEmailObject, l.forgotPasswordEmailTemplate, ['%TOKEN%'])) {
                        l.forgotErrors = true;
                        l.isValid = false;
                    }
                    if (l.forgotErrorsMister = !validate(l.forgotPasswordEmail, l.forgotPasswordEmailName, l.forgotPasswordEmailObject, l.forgotPasswordEmailTemplateMister, ['%TOKEN%'])) {
                        l.forgotErrorsMister = true;
                        l.isValid = false;
                    }
                    if (l.forgotErrorsMiss = !validate(l.forgotPasswordEmail, l.forgotPasswordEmailName, l.forgotPasswordEmailObject, l.forgotPasswordEmailTemplateMiss, ['%TOKEN%'])) {
                        l.forgotErrorsMiss = true;
                        l.isValid = false;
                    }
                }
            });
        }
    };
});

directivesRuby.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
});


directivesRuby.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return w.height();
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.style = function (minus) {
                return {
                    'height': (newValue - minus) + 'px',
                    'width': 100 + '%'
                };
            };

        });

        w.bind('resize', function () {
            scope.$apply();
        });
    }
});

directivesRuby.directive('filteredTable', function($filter) {
    return {
        restrict : 'E',
        templateUrl : '/assets/template/filtered-table.html',
        scope : {
            headers : '=',
            filterCriteria : '=',
            model : '=',
            modelName : '@',
            go : '&',
            fetchResult : '&',
            count : '='
        },
        link : function($scope) {
            $scope.pageSize = 10;
            $scope.models = {};
            $scope.searchBy = {};
            function callFetchResult(reset) {
                //var out = new Array();
                for ( var key in $scope.searchBy) {
                    if ($scope.searchBy[key] && $scope.searchBy[key].length) {
                        //out.push(key + '=' + $scope.searchBy[key]);
                        if(key.toUpperCase() == 'isdeleted'.toUpperCase()) {
                            if($scope.searchBy[key].toUpperCase() == 'YES'.toUpperCase())
                                $scope.filterCriteria[key] = 1;
                            else if ($scope.searchBy[key].toUpperCase() == 'NO'.toUpperCase())
                                $scope.filterCriteria[key] = 0;
                        }
                        else
                            $scope.filterCriteria[key] =  $scope.searchBy[key];
                    }
                    else {
                        delete $scope.filterCriteria[key];
                    }
                }
                /*if (out.length) {
                    $scope.filterCriteria.searchBy = out;
                } else {
                    delete $scope.filterCriteria.searchBy;
                }*/
                $scope.fetchResult().$promise.then(function() {
                    // The request fires correctly but sometimes the ui doesn't
                    // update, that's a fix
                    if (reset) {
                        $scope.filterCriteria.pageNumber = 1;
                    }
                });

            }
            ;
            // called when navigate to another page in the pagination
            $scope.$watch('filterCriteria.pageNumber', function() {
                callFetchResult(false);
            });
            // called when navigate to another page in the pagination
            $scope.selectPage = function(page) {
                $scope.filterCriteria.pageNumber = page;
                callFetchResult(false);
            };

            // Will be called when filtering the grid, will reset the page
            // number to one
            $scope.filterResult = function(modelName) {
                $scope.searchBy[modelName] = $scope.models[modelName];
                $scope.filterCriteria.pageNumber = 1;
                callFetchResult(true);
            };

            // call back function that we passed to our custom directive sortBy,
            // will be called when clicking on any field to sort
            $scope.onSort = function(sortedBy, sortDir) {
                $scope.filterCriteria.sortDir = sortDir;
                $scope.filterCriteria.sortedBy = sortedBy;
                $scope.filterCriteria.pageNumber = 1;
                callFetchResult(true);
            };

            $scope.clickGo = function(object) {
                $scope.go({
                    object : object
                });
            };

            $scope.pageSizeChanges = function() {
                $scope.filterCriteria.pageNumber = 1;
                callFetchResult(true);
            };

            $scope.resolve = function(cur, ns, type) {
                var undef;
                ns = ns.split('.');
                while (cur && ns[0]) {
                    cur = cur[ns.shift()] || undef;
                }
                if (type == 'boolean') {
                    if (cur == true)
                        return 'Yes';
                    else
                        return 'No';
                }
                if (cur && type !== undefined && type == 'date') {
                    return $filter('date')(cur, 'medium');
                }

                return cur;

            };
        }
    };
});

directivesRuby.directive('sortBy', function () {
    return {
        templateUrl: '/assets/template/sort-by.html',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            sortdir: '=',
            sortedby: '=',
            sortvalue: '@',
            onsort: '='
        },
        link: function (scope, element, attrs) {
            scope.sort = function () {
                if (scope.sortedby == scope.sortvalue)
                    scope.sortdir = scope.sortdir == 'asc' ? 'desc' : 'asc';
                else {
                    scope.sortedby = scope.sortvalue;
                    scope.sortdir = 'asc';
                }
                scope.onsort(scope.sortedby, scope.sortdir);
            };
        }
    };
});

directivesRuby.directive('onBlurChange', function ($parse) {
    return function (scope, element, attr) {
        var fn = $parse(attr['onBlurChange']);
        var hasChanged = false;
        element.on('change', function (event) {
            hasChanged = true;
        });

        element.on('blur', function (event) {
            if (hasChanged) {
                scope.$apply(function () {
                    fn(scope, {$event: event});
                });
                hasChanged = false;
            }
        });
    };
});

directivesRuby.directive('onEnterBlur', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                element.blur();
                event.preventDefault();
            }
        });
    };
});

