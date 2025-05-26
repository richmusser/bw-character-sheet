class BWCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["bw-sheet", "sheet", "actor"],
            template: "modules/bw-character-sheet/templates/character-sheet.html",
            width: 800,
            height: 900,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
        });
    }

    getData() {
        const data = super.getData();
        data.actor = this.actor;
        data.system = this.actor.system;
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Handle all input changes
        html.find('input, select, textarea').on('change', this._onInputChange.bind(this));
    }

    async _onInputChange(event) {
        event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;

        // Update the actor data
        await this.actor.update({
            [name]: value
        });
    }
}

// Register the sheet
Actors.registerSheet("bw-sheets", BWCharacterSheet, {
    types: ["character"],
    makeDefault: true
});

// Initialize the module
Hooks.once('init', async function() {
    console.log('Burning Wheel Character Sheets | Initializing');
});

// When the module is ready
Hooks.once('ready', async function() {
    console.log('Burning Wheel Character Sheets | Ready');
}); 