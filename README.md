# Firefox Pass
An add-on for accessing the [pass](http://www.passwordstore.org/) password manager directly from Firefox. It adds an context menu item to password inputs that can be used to retrieve a password from the pass store. Once the correct password is selected, it will be copied to clipboard for 45 seconds (using `pass --clip`) during which it can be pasted to a password field.

# Requirements
The `pass` script needs to be installed and initialized. The add-on can be built using the `jpm` utility (`npm install -g jpm`).
