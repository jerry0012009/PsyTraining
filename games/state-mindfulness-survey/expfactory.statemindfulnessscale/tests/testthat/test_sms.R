library(tidyverse)
context('State Mindfulness Survey')

df <- expfactory::process_expfactory_survey(token='1', survey='../fixtures/sms-flat.json', flat=TRUE) %>%
  rename(p = Token)
test_that("process_expfactory_survey() can process flat JSON", {
  expect_is(df, 'data.frame')
})
test_that('SMS flat JSON correctly parsed', {
  expect_equal(df[1,4], 'I was aware of different emotions that arose in me')
})
sms <- state_mindfulness_scale(df)
test_that('SMS total value', {
  expect_equal(sms[1,'sms_total'], 79)
})
test_that('SMS mind value', {
  expect_equal(sms[1,'sms_mind'], 60)
})
test_that('SMS body value', {
  expect_equal(sms[1,'sms_body'], 19)
})

df <- expfactory::process_expfactory_survey(token='1', survey='../fixtures/sms.json') %>%
  mutate(p = 1)
test_that("process_expfactory_survey() returns a data frame", {
   expect_is(df, 'data.frame')
})
test_that('SMS structured JSON correctly parsed', {
  expect_equal(df[1,4], 'I was aware of different emotions that arose in me')
})
sms <- state_mindfulness_scale(df)
test_that('SMS total value', {
  expect_equal(sms[1,'sms_total'], 92)
})
test_that('SMS mind value', {
  expect_equal(sms[1,'sms_mind'], 68)
})
test_that('SMS body value', {
  expect_equal(sms[1,'sms_body'], 24)
})


