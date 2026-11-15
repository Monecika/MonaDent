package org.openapitools.configuration;

import com.monadent.contracts.teeth.ToothFinding;
import com.monadent.contracts.teeth.ToothType;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;

@Configuration(value = "org.openapitools.configuration.enumConverterConfiguration")
public class EnumConverterConfiguration {

    @Bean(name = "org.openapitools.configuration.EnumConverterConfiguration.toothFindingConverter")
    Converter<String, ToothFinding> toothFindingConverter() {
        return new Converter<String, ToothFinding>() {
            @Override
            public ToothFinding convert(String source) {
                return ToothFinding.fromValue(source);
            }
        };
    }
    @Bean(name = "org.openapitools.configuration.EnumConverterConfiguration.toothTypeConverter")
    Converter<String, ToothType> toothTypeConverter() {
        return new Converter<String, ToothType>() {
            @Override
            public ToothType convert(String source) {
                return ToothType.fromValue(source);
            }
        };
    }

}
