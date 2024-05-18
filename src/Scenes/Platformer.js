class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 50000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 900;
        this.JUMP_VELOCITY = -600;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.bg = this.add.image(-800, 0, 'background').setOrigin(0).setScale(1.2);
        this.bg2 = this.add.image(0, 0, 'background').setOrigin(0).setScale(1.2);
        this.bg3 = this.add.image(800, 0, 'background').setOrigin(0).setScale(1.2);
        this.bg4 = this.add.image(1600, 0, 'background').setOrigin(0).setScale(1.2);
        this.bg5 = this.add.image(2400, 0, 'background').setOrigin(0).setScale(1.2);
        this.map = this.add.tilemap("Level1", 18, 18, 140, 25);
        this.physics.world.setBounds(0,0, this.map.widthInPixels, this.map.heightInPixels);
        

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");

        // Create a layer test
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // set up player
        my.sprite.player = this.physics.add.sprite(0, 0, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.1, 0.1);
        this.cameras.main.setScroll(my.sprite.player.x, my.sprite.player.y);
        this.cameras.main.setZoom(1.8);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

    }

    update() {
        if(cursors.left.isDown) {
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            this.bg.x += 0.15;
            this.bg2.x += 0.15;
            this.bg3.x += 0.15;
            this.bg4.x += 0.15;
            this.bg5.x += 0.15;

        } else if(cursors.right.isDown) {
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            this.bg.x -= 0.15;
            this.bg2.x -= 0.15;
            this.bg3.x -= 0.15;
            this.bg4.x -= 0.15;
            this.bg5.x -= 0.15;

        } else {
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);

            my.sprite.player.anims.play('idle');
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }
        
    }
}