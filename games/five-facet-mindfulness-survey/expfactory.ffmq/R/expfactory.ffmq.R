#' Calculate FFMQ scores
#'
#' Calculates FFMQ scores.  Expects a data frame
#' formatted by \code{\link[expfactory:process_expfactory_survey]{expfactory::process_expfactory_survey}}, containing
#' responses from a single participant.
#'
#' @param df Data frame
#' @importFrom magrittr %>%
#' @importFrom dplyr filter mutate select tibble
#' @importFrom expfactory reverse_code_survey
#' @importFrom rlang .data
#' @importFrom tidyr pivot_wider
#' @keywords FFMQ
#' @export
#' @return tibble
ffmq <- function(df) {
  # 39 items from Baer et al., (2006)
  df <- df %>% mutate(value = as.integer(.data$value))

  # The experiment factory FFMQ survey reverse-codes these items, so we don't need to do it here.
  # c(3, 5, 8, 10, 12, 13, 14, 16, 17, 18, 22, 23, 25, 28, 30, 34, 35, 38, 39)

  ## Factors (Baer et al., 2006, Table 3)
  observe_q <- c("When I.m walking, I deliberately notice the sensations of my body moving. ",
               "When I take a shower or bath, I stay alert to the sensations of water on my body. ",
               "I notice how foods and drinks affect my thoughts, bodily sensations, and emotions. ",
               "I pay attention to sensations, such as the wind in my hair or sun on my face. ",
               "I pay attention to sounds, such as clocks ticking, birds chirping, or cars passing. ",
               "I notice the smells and aromas of things. ",
               "I notice visual elements in art or nature, such as colors, shapes, textures, or patterns of light and shadow. ",
               "I pay attention to how my emotions affect my thoughts and behavior. ")
  observe <- df %>%
    filter(grepl(paste(observe_q, collapse="|"), .data$question)) %>%
    select(.data$value) %>%
    mutate(item = c(1, 6, 11, 15, 20, 26, 31, 36)) %>%
    pivot_wider(names_from = .data$item, values_from = .data$value, names_prefix = 'q')
  observe <- observe %>% mutate(observe = rowSums(observe))

  describe_q <- c("I.m good at finding words to describe my feelings. ",
                "I can easily put my beliefs, opinions, and expectations into words. ",
                "It.s hard for me to find the words to describe what I.m thinking. ",
                "I have trouble thinking of the right words to express how I feel about things.",
                "When I have a sensation in my body, it.s difficult for me to describe it because I can.t find the right words. ",
                "Even when I.m feeling terribly upset, I can find a way to put it into words. ",
                "My natural tendency is to put my experiences into words. ",
                "I can usually describe how I feel at the moment in considerable detail. ")
  describe <- df %>%
    filter(grepl(paste(describe_q, collapse="|"), .data$question)) %>%
    select(.data$value) %>%
    mutate(item = c(2, 7, 12, 16, 22, 27, 32, 37)) %>%
    pivot_wider(names_from = .data$item, values_from = .data$value, names_prefix = 'q')
  describe <- describe %>% mutate(describe = rowSums(describe))
  
  actaware_q <- c("I find it difficult to stay focused on what.s happening in the present. ",
                "It seems I am .running on automatic. without much awareness of what I.m doing. ",
                "I rush through activities without being really attentive to them. ",
                "I do jobs or tasks automatically without being aware of what I.m doing. ",
                "I find myself doing things without paying attention. ",
                "When I do things, my mind wanders off and I.m easily distracted. ",
                "I don.t pay attention to what I.m doing because I.m daydreaming, worrying, or otherwise distracted. ",
                "I am easily distracted. ")
  actaware <- df %>%
    filter(grepl(paste(actaware_q, collapse="|"), .data$question)) %>%
    select(.data$value) %>%
    mutate(item = c(18, 23, 28, 34, 38, 5, 8, 13)) %>%
    pivot_wider(names_from = .data$item, values_from = .data$value, names_prefix = 'q')
  actaware <- actaware %>% mutate(actaware = rowSums(actaware))
  
  nonjudge_q <- c("I criticize myself for having irrational or inappropriate emotions. ",
                "I tell myself I shouldn.t be feeling the way I.m feeling. ",
                "I believe some of my thoughts are abnormal or bad and I shouldn.t think that way.",
                "I make judgments about whether my thoughts are good or bad. ",
                "I tell myself that I shouldn.t be thinking the way I.m thinking. ",
                "I think some of my emotions are bad or inappropriate and I shouldn.t feel them. ",
                "I disapprove of myself when I have irrational ideas. ",
                "When I have distressing thoughts or images, I judge myself as good or bad, depending what the ")
  nonjudge <- df %>%
    filter(grepl(paste(nonjudge_q, collapse="|"), .data$question)) %>%
    select(.data$value) %>%
    mutate(item = c(3, 10, 14, 17, 25, 30, 39, 35)) %>%
    pivot_wider(names_from = .data$item, values_from = .data$value, names_prefix = 'q')
  nonjudge <- nonjudge %>% mutate(nonjudge = rowSums(nonjudge))

  nonreact_q <- c("I perceive my feelings and emotions without having to react to them. ",
                "I watch my feelings without getting lost in them. ",
                "In difficult situations, I can pause without immediately reacting. ",
                "When I have distressing thoughts or images I am able just to notice them without reacting. ",
                "When I have distressing thoughts or images, I feel calm soon after.",
                "When I have distressing thoughts or images, I .step back. and am aware of the thought or image without getting taken over by it. ",
                "When I have distressing thoughts or images, I just notice them and let them go. ")
  nonreact <- df %>%
    filter(grepl(paste(nonreact_q, collapse="|"), .data$question)) %>%
    select(.data$value) %>%
    mutate(item = c(4, 9, 21, 29, 24, 19, 33)) %>%
    pivot_wider(names_from = .data$item, values_from = .data$value, names_prefix = 'q')
  nonreact <- nonreact %>% mutate(nonreact = rowSums(nonreact))
  
  tibble(observe, describe, actaware, nonjudge, nonreact)
}
