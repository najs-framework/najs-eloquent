"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserOne extends exports.Eloquent {
    doSomething(...args) { }
    static doesSomething(...args) { }
}
exports.UserOne = UserOne;
const userOneModel = new UserOne();
const resultOne = userOneModel.where().first();
const firstNameOne = resultOne.first_name;
resultOne.last_name = 'first way assignment';
resultOne.doSomething(firstNameOne);
UserOne.doesSomething(firstNameOne);
UserOne.doesSomething(userOneModel.first());
userOneModel.first().first_name = 'test';
// 2nd way -------------------------------------------------------------------------------------------------------------
class UserTwo extends exports.Eloquent.Mongoose() {
    doSomething(...args) { }
    static doesSomething(...args) { }
}
exports.UserTwo = UserTwo;
const resultTwo = UserTwo.where().first();
const firstNameTwo = resultTwo.first_name;
resultTwo.last_name = 'third way assignment';
resultTwo.doSomething(firstNameTwo);
UserTwo.doesSomething(firstNameOne);
UserTwo.doesSomething(UserTwo.first());
UserTwo.first().first_name = 'test';
const userTwoModel = new UserTwo();
const resultTwo_Instance = userTwoModel.where().first();
const firstNameTwo_Instance = resultTwo_Instance.first_name;
resultTwo_Instance.last_name = 'third way assignment';
resultTwo_Instance.doSomething(firstNameTwo_Instance);
// 3rd way -------------------------------------------------------------------------------------------------------------
class UserThree extends exports.Eloquent {
    doSomething(...args) { }
    static doesSomething(...args) { }
}
exports.UserThree = UserThree;
const userThreeModel = new UserThree();
const resultThree = userThreeModel.where().first();
const firstNameThree = resultThree.first_name;
resultThree.last_name = 'third way assignment';
resultThree.doSomething(firstNameThree);
UserThree.doesSomething(firstNameOne);
UserThree.doesSomething(userThreeModel.first());
userThreeModel.first().first_name = 'test';
