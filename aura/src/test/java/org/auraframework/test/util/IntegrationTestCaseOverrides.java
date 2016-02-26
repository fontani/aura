/*
 * Copyright (C) 2013 salesforce.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.auraframework.test.util;

import org.auraframework.test.TestContextAdapter;
import org.auraframework.test.TestContextAdapterImpl;
import org.auraframework.test.source.StringSourceExternalLoader;
import org.auraframework.test.source.StringSourceLoader;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Scope;

/**
 * Overrides for beans that will not work outside of the servlets' ApplicationContext.
 */
public class IntegrationTestCaseOverrides {
    private final static TestContextAdapter testContextAdapter = new TestContextAdapterImpl();

    /**
     * Use a true singleton TestContextAdapter for integration tests.
     */
    @Primary
    @Bean
    @Scope(BeanDefinition.SCOPE_SINGLETON)
    public static TestContextAdapter testContextAdapter() {
        return testContextAdapter;
    }

    @Primary
    @Bean
    public StringSourceLoader remoteStringSourceLoader() {
        return new StringSourceExternalLoader();
    }
}
