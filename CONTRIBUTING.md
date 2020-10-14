# Contributing to react-mindee-js

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to react-mindee-js which are hosted on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by the following [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [contact@mindee.com](mailto:contact@mindee.com).

## How Can I Contribute

### Reporting Bugs

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/).

To help maintainers and the community to be efficient, follow these guidelines:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible. When listing steps, **don't just say what you did, but explain how you did it**. For example, with canvas related problem, explain if you used the mouse or a keyboard shortcut, what kind of image input it is etc...
* **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.
* **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

Include details about your configuration and environment:

* **Which version of react-mindee-js are you using?**
* **What's the name and version of the browser you're using, on which OS**?

### Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/).

Make sure to provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of the sdk which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
* **Specify which version of react-mindee-js you're using.**
* **Specify the name and version of the browser and OS you're using.**

### Pull Requests

The process described here has several goals:

- Maintain mindee SDK quality
- Fix problems that are important to users
- Engage the community in working toward the best possible SDK
- Enable a sustainable system for mindee's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. Follow the [styleguides](#styleguides)

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Please prefix your commit message with `chg:`, `new:` or `fix:` according to the content
* Consider starting the commit message with an applicable emoji, see [gitmoji](https://gitmoji.carloscuesta.me/) as a reference.

Example:

* chg: :pencil: Add usage section in README
* new: :sparkles: Add CONTRIBUTING file in repository
* fix: :bug: MyComponent - Prevent MouseEvent from firing unexpectedly

### JavaScript Styleguide

We keep our code base consistent and we expect React/JavaScript code to must adhere to [JavaScript Standard Style](https://standardjs.com/).
When possible, adding [flow](https://flow.org/) types is also expected.
