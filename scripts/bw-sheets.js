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

        // Initialize stats if they don't exist
        if (!data.system.stats) {
            data.system.stats = {};
        }

        // Initialize each stat with default values if they don't exist
        const stats = ['will', 'power', 'agility', 'perception', 'forte', 'speed'];
        stats.forEach(stat => {
            if (!data.system.stats[stat]) {
                data.system.stats[stat] = {
                    shade: 'B',
                    exponent: 0
                };
            }
        });

        // Initialize beliefs if they don't exist
        if (!data.system.beliefs) {
            data.system.beliefs = {};
        }
        // Ensure 4 beliefs exist
        for (let i = 0; i < 4; i++) {
            if (!data.system.beliefs[i]) {
                data.system.beliefs[i] = { text: "" };
            }
        }

        // Initialize instincts if they don't exist
        if (!data.system.instincts) {
            data.system.instincts = { text: "" };
        }

        // Initialize artha if it doesn't exist
        if (!data.system.artha) {
            data.system.artha = {
                fate: 0,
                persona: 0,
                deeds: 0
            };
        }

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
    
    // Register partial templates
    const statInputTemplate = await fetch("modules/bw-character-sheet/templates/partials/stat-input.html").then(r => r.text());
    Handlebars.registerPartial("stat-input", statInputTemplate);
});

// When the module is ready
Hooks.once('ready', async function() {
    console.log('Burning Wheel Character Sheets | Ready');
}); 