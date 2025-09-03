# Experiment Factory Experiment

Hi Friend! This is an Experiment that is friendly for use in the [Experiment Factory](https://expfactory.github.io/expfactory). You can run it locally by putting these files in a web server, or use the Experiment Factory to generate a reproducible container. Check out the documentation above for more information, or [post an issue](https://www.github.com/expfactory/expfactory/issues) if you have any questions.

![https://expfactory.github.io/expfactory/img/expfactoryticketyellow.png](https://expfactory.github.io/expfactory/img/expfactoryticketyellow.png)



# The 5-Minute Stroop

The 5-minute Stroop is designed to provide a reliable and (statistically) powerful way to capture the Stroop phenomenon in a short amount of time. 

Brief versions of cognitive tasks may be useful in cases where researchers are concerned about: (1) participant fatigue or attrition, (2) the costs of doing research and paying participants (for example, on MTurk participants are paid commensurate with the time they spend engaged with the research, and so there is an incentive to minimize the demands placed on their time), or (3) where there simply isn't a need for a longer task (in which case, a shorter task is more respectful of participants' time).

With that in mind, this task was created with the following design considerations:

- The task should generate the Stroop phenomenon (slower response times for incongruent vs. congruent stimuli) with a medium-to-large effect size
- The task should be user-friendly, accessible, and provide a user experience that is not unpleasant
- The task should take approximately 5 minutes to complete

To achieve this, the following changes were made to the default Experiment Factory Stroop task:

## Changes for Statistical Power / Effect

- The ratio of congruent:incongruent trials was increased from 1:1 to 2:1, since proportion congruency has been shown in some past research to increase the size of the Stroop effect
- Attention checks were added to the test phase, allowing researchers to more clearly identify "bad subjects"


## Changes for Accessibility and User-Friendliness
- Colors were selected to maximize accessibility for individuals with color-blindness (Accessibility of colors was confirmed using a color-blindness simulator, Color Oracle [http://colororacle.org])
- The background color was changed from white to black, to minimize eye strain and maximize contrast
- A figure was added to the instructions to illustrate a suggested finger placement on the keyboard

## Changes for Brevity
- In this version, when a response is entered the trial ends and feedback is displayed right away (Previously, trials had a fixed duration)
- The number of practice trials was reduced from 24 to 18
- The number of test trials was reduced from 96 to 72