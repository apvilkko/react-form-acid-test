# React Form Acid Test

Comparison of React form libraries in real-life use cases.

Requirements for our application:

- Input components are shared and are not coupled to any form library
- Validation is done with a single function for the whole form
- Multilanguage fields are dynamic i.e. the displayed languages change at runtime when filling the form
  - TODO: multi language field validation errors should be reset on languages change
- Form is fillable in parts (tabbed sections visible one at a time)
- Form can be remotely/programmatically submitted (not tied to submit type input button)
- Field arrays with lots of items
- Has to work with variety of browsers (IE11 support until late 2021 EOL)
- Checkboxes/radio buttons with dynamic extra fields based on choice
