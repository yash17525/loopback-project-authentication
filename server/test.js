async function foo() {

    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve("done!"), 1000)
    });
  
    let result = await promise; // wait until the promise resolves (*)
  
    // alert(result); // "done!"
    // console.log(result)
    return result;
  }
  
  async function f(){
    let response = await foo();
    console.log(response);
  }

  f();