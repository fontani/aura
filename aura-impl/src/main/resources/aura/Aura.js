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

// -- Namespaces ------------------------------------------------------------
// #include aura.AuraNamespaces

// -- Aura Bootstrap ------------------------------------------------------------
Aura.time = window.performance && window.performance.now ? window.performance.now.bind(performance) : function(){return Date.now();};
Aura["bootstrap"] = Aura["bootstrap"] || {};
Aura["bootstrap"]["visibilityStateStart"] = document.visibilityState;
Aura.bootstrapMark = function (mark, value) {
    //#if {"excludeModes" : ["PRODUCTION"]}
    if (window.console&&window.console.timeStamp) {
        window.console.timeStamp(mark);
    }
    //#end
    this["bootstrap"][mark] = value || this.time();
};


// bootstrap robustness:
// - all files required for bootstrap are loaded with sync <script> tags
// - DOMContentLoaded is fired after DOM is ready, which includes executing all sync <script> tags
// - to detect errors we wait for DOMContentLoaded then check for all bootstrap file markers
// NOTE: if Aura is injected into the page (Lightning Out or AIS) then DOMContentLoaded is fired
// before aura.js is loaded/executed, so verifyBootstrap() is never invoked.
(function bootstrapRobustness() {
    function verifyBootstrap() {
        document.removeEventListener('DOMContentLoaded', verifyBootstrap);

        // now that all <script> are loaded can update network bootstrap.js load status
        $A.clientService.setAppBootstrapStatus();

        // wait for bootstrap to load from storage:
        // 1. wait for $A.initAsync()'s AuraContext callback to be invoked: gvsFromStorage gets assigned true/false
        // 2. if gvpsFromStorage is true then wait for bootstrap from storage (if false then bootstrap is not loaded from storage)
        if ($A.clientService.gvpsFromStorage === undefined || ($A.clientService.gvpsFromStorage && Aura["appBootstrapCacheStatus"] === undefined)) {
            setTimeout(verifyBootstrap, 1000);
            return;
        }

        var state = $A.clientService.getBootstrapState(false);

        var allFilesLoaded = Object.keys(state).reduce(function(prev, curr) {
            return prev && state[curr];
        }, true);
        if (!allFilesLoaded) {
            $A.clientService.dumpCachesAndReload(true);
        }
    }

    document.addEventListener('DOMContentLoaded', verifyBootstrap);
})();

// This, $A, is supposed to be our ONLY window-polluting top-level variable.
// Everything else in Aura is attached to it.
// window['$A'] = {};

// -- Polyfills --------------------------------------------------------
// #include aura.polyfill.Array
// #include aura.polyfill.Function
// #include aura.polyfill.RequestAnimationFrame
// #include aura.polyfill.Object
// #include aura.polyfill.Json
// #include aura.polyfill.Promise
// #include aura.polyfill.TextEncoder
// #include aura.polyfill.stackframe
// #include aura.polyfill.error-stack-parser

// -- Exporter ---------------------------------------------------------
// #include aura.util.ExportSymbolsHelper

// -- Context -----------------------------------------------------------
// #include aura.context.AuraContext

// -- Utils ------------------------------------------------------------
// #include aura.util.Style
// #include aura.util.Bitset
// #include aura.util.NumberFormat
// #include aura.util.Mutex
// #include aura.util.DocLevelHandler
// #include aura.util.SizeEstimator
// #include aura.util.SecureFilters
// #include aura.util.Util

// #include aura.Logger
// #include aura.util.Override

// -- Errors ------------------------------------------------------------
// #include aura.error.AuraError
// #include aura.error.AuraFriendlyError

// -- System ------------------------------------------------------------
// #include aura.system.DefDescriptor

// -- Style -------------------------------------------------------------
// #include aura.style.StyleDef

// -- Flavors -----------------------------------------------------------
// #include aura.flavors.FlavorDefaultDef
// #include aura.flavors.FlavorsDef

// -- Value -------------------------------------------------------------
// #include aura.value.PropertyReferenceValue
// #include aura.value.FunctionCallValue
// #include aura.value.PassthroughValue
// #include aura.value.ValueFactory
// #include aura.value.ExpressionFunctions

// -- Model -------------------------------------------------------------
// #include aura.model.ValueDef
// #include aura.model.ModelDef
// #include aura.model.Model

// -- Component ---------------------------------------------------------
// #include aura.component.ComponentClassRegistry
// #include aura.component.ComponentDefStorage
// #include aura.component.Component
// #include aura.component.BaseComponent
// #include aura.component.ExpressionComponent
// #include aura.component.HtmlComponent
// #include aura.component.IfComponent
// #include aura.component.IterationComponent
// #include aura.component.TextComponent
// #include aura.component.InvalidComponent
// #include aura.component.ComponentDef
// #include aura.component.ActionValueProvider
// #include aura.component.EventValueProvider
// #include aura.component.StyleValueProvider

// -- Renderer ----------------------------------------------------------

// -- Provider ----------------------------------------------------------
// #include aura.provider.GlobalValueProviders
// #include aura.provider.LabelQueue
// #include aura.provider.LabelValueProvider
// #include aura.provider.ObjectValueProvider
// #include aura.provider.ContextValueProvider

// -- Helper -------------------------------------------------------------

// -- Library ------------------------------------------------------------
// #include aura.library.LibraryIncludeRegistry
// #include aura.library.LibraryRegistry

// -- Event --------------------------------------------------------------
// #include aura.event.EventDef
// #include aura.event.Event

// -- Controller ---------------------------------------------------------
// #include aura.controller.ActionDef
// #include aura.controller.Action
// #include aura.controller.ControllerDef

// -- Attribute ----------------------------------------------------------
// #include aura.attribute.AttributeDef
// #include aura.attribute.AttributeSet
// #include aura.attribute.AttributeDefSet

// -- Method ----------------------------------------------------------
// #include aura.method.MethodDef

// -- RequiredVersion ----------------------------------------------------------
// #include aura.requiredVersion.RequiredVersionDef
// #include aura.requiredVersion.RequiredVersionDefSet

// -- L10n ---------------------------------------------------------------
// #include aura.l10n.AuraLocalizationContext

// -- Storage -------------------------------------------------------------
// #include aura.storage.AuraStorageService
// #include aura.storage.AuraStorage

// -- Services -----------------------------------------------------------
// #include aura.AuraClientService
// #include aura.AuraComponentContext
// #include aura.AuraComponentService
// #include aura.AuraRenderingService
// #include aura.AuraExpressionService
// #include aura.AuraHistoryService
// #include aura.AuraEventService
// #include aura.AuraLocalizationService
// #include aura.AuraStyleService
// #include aura.metrics.AuraMetricsService

// -- Mode injection ------------------------------------------------------
// #include {"excludeModes" : ["PRODUCTION", "PRODUCTIONDEBUG"], "path" : "aura.AuraDevToolService"}

//-- LockerService -----------------------------------------------------------
//#include aura.locker.LockerService

// -- $A Instance ------------------------------------------------------------
// #include aura.AuraInstance

// At this point, Aura has been defined with all our types on it, but $A itself
// is just a placeholder. Use this function to preserve Aura while populating
// $A, without making a new top-level name:
(function bootstrap() {
    Aura.bootstrapMark("execAuraJs");
    /**
     * @description This, $A, is supposed to be our ONLY window-polluting top-level variable. Everything else in Aura is
     *            attached to it.
     *
     * @namespace
     *
     * @borrows AuraComponentService#createComponent as $A.createComponent
     * @borrows AuraComponentService#createComponents as $A.createComponents
     * @borrows AuraComponentService#getComponent as $A.getComponent
     * @borrows AuraClientService#enqueueAction as $A.enqueueAction
     * @borrows AuraInstance#getRoot as $A.getRoot
     * @borrows AuraInstance#getCallback as $A.getCallback
     * @borrows AuraInstance#get as $A.get
     * @borrows AuraInstance#set as $A.set
     * @borrows AuraInstance#error as $A.error
     * @borrows AuraInstance#log as $A.log
     * @borrows AuraInstance#warning as $A.warning
     * @borrows AuraInstance#run as $A.run
     * @borrows AuraComponentService#newComponentDeprecated as $A.newCmp
     * @borrows AuraComponentService#newComponentAsync as $A.newCmpAsync
     * @borrows AuraInstance#localizationService as localizationService
     * @borrows AuraInstance#util as util
     * @borrows AuraInstance#reportError as $A.reportError
     */
    window['$A'] = new AuraInstance();
})();

// TODO: Remove the legacy 'aura' top-level name.
window['aura'] = window['$A'];

// -- Storage Adapters -------------------------------------------------
// #include aura.storage.adapters.MemoryAdapter
// #include aura.storage.adapters.IndexedDBAdapter
// #include aura.storage.adapters.CryptoAdapter

// -- Metrics Plugins --------------------------------------------------
// #include aura.metrics.plugins.TransportMetricsPlugin
// #include aura.metrics.plugins.PerfMetricsPlugin
// #include aura.metrics.plugins.QueuedActionsMetricsPlugin
// #include aura.metrics.plugins.AuraContextPlugin
// #include aura.metrics.plugins.DomHandlersPlugin

// #include {"excludeModes" : ["PRODUCTION"], "path" : "aura.metrics.plugins.ComponentServiceMetricsPlugin"}
// #include aura.Logging
// #include {"modes" : ["DOC","TESTING","AUTOTESTING", "TESTINGDEBUG", "AUTOTESTINGDEBUG"], "path" : "aura.test.Test"}

/*
 * Async Bootstrap dependency
 * The scripts are loaded with no order, which means we need to call initAsync in case it was already evaluated.
 * TODO W-??? change bootstrap scripts to be async+defered for perf gains, after which this code block will be required
*/

Aura["frameworkJsReady"] = true;
if (Aura["initConfig"]) {
  setTimeout(function () {
    $A.initAsync(Aura["initConfig"]);
  }, 0);
}


// External libraries (like moment.js) will be appended here
