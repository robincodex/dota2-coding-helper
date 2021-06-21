import * as vscode from 'vscode';
import { API } from './api_service';
import { loadLocale } from './utils';
import { PanoramaCSS } from './panorama_css';
import { AbilitiesDataDriven } from './abilities_data_driven';
import { CustomGameDocuments } from './documents_service';
import { SoundEventsEditorProvider } from './editors/sound_events_editor';
import { CustomGameSettingsProvider } from './editors/custom_game_settings';

export function activate(context: vscode.ExtensionContext) {
    loadLocale();
    context.subscriptions.push(new API(context, 'js').register());
    context.subscriptions.push(new API(context, 'lua_server').register());
    context.subscriptions.push(new API(context, 'lua_client').register());
    context.subscriptions.push(new PanoramaCSS(context).register());
    context.subscriptions.push(new AbilitiesDataDriven(context).register());
    context.subscriptions.push(new CustomGameDocuments(context).register());

    context.subscriptions.push(SoundEventsEditorProvider.register(context));
    context.subscriptions.push(CustomGameSettingsProvider.register(context));
}

export function deactivate() {}
