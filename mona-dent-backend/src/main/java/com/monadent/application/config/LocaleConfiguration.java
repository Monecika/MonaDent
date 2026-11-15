package com.monadent.application.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

import java.util.List;
import java.util.Locale;

@Configuration
public class LocaleConfiguration {

    @Bean
    public LocaleResolver localeResolver() {
        AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver();
        localeResolver.setSupportedLocales(List.of(
                Locale.forLanguageTag("ro"),
                Locale.forLanguageTag("ru"),
                Locale.forLanguageTag("en")));
        localeResolver.setDefaultLocale(Locale.forLanguageTag("ro"));
        return localeResolver;
    }
}
