# consent-task

# About

This is a task designed for use in the [Experiment Factory](https://expfactory.github.io/expfactory). You can run it locally by putting these files in a web server, or use the Experiment Factory to generate a reproducible container.

# Purpose

Display study information and request informed consent from participant.

# Usage

You'll almost certainly want to modify the default consent page (`study_info.html`) with information about your own study.  If you're building a container, this means that you'll want to make these changes in a local copy of this repo [see Local Experiment Selection](https://expfactory.github.io/expfactory/generate#detailed-start).  This allows you to modify HTML and CSS, include institution logos etc. prior to building your container.

When using this task in an Experiment Factory container, URLs for each participant can be configured by passing `url` in the query string (see [Participant Variables](https://expfactory.github.io/expfactory/usage), and the Demo below).

You could also use this task for study debrief, by including it in a container twice ([see Examples](https://expfactory.github.io/expfactory/generate#detailed-start)) under the names `consent` and `debrief`.  So you could use participant variables to specify different consent and debrief URLs for each of your experimental conditions.   

# Demo

* [Experimental condition](https://earcanal.github.io/consent-task/?url=experimental.html).
* [Control condition](https://earcanal.github.io/consent-task/?url=control.html).