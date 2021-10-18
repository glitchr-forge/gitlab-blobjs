class Blob {

    constructor(el) {

        this.dom = {};
        this.dom.el = el;

        //
        // Prepare SVG
        //
        var elID = this.dom.el.getAttribute("id");
        var shapeID = this.dom.el.dataset.shape;
        if(Blob.shapeList[shapeID] === undefined)
            throw "Shape \""+shapeID+"\" not found in the list";

        this.dom.deco = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.dom.deco.classList.add("blob__deco");
        
        var deco = Blob.shapeList[shapeID]["deco"];
        if(deco) {
            var decoPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                decoPath.setAttribute("class", "blob__deco");
                decoPath.setAttribute("d", deco);

            this.dom.deco.appendChild(decoPath);
        }

        // Clip path
        var clip = Blob.shapeList[shapeID]["clip"];
        var clipPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            clipPath.setAttribute("class", "blob__clippath");
            clipPath.setAttribute("d", clip);

        this.dom.clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        this.dom.clipPath.appendChild(clipPath);
        this.dom.clipPath.setAttribute("id", elID+"-clippath-"+shapeID);
            
        var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
            image.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.dom.el.dataset.image);
            image.setAttribute("class", "blob__img");
            image.setAttribute("x", "0");
            image.setAttribute("y", "0");
            image.setAttribute("height", "600px");
            image.setAttribute("width", "600px");

        this.dom.image = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.dom.image.setAttribute("clip-path", "url(#"+this.dom.clipPath.getAttribute("id")+")");
        this.dom.image.appendChild(image);

        this.dom.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.dom.svg.classList.add("blob__svg");
        this.dom.svg.setAttribute("viewBox", "0 0 600 600");
        this.dom.svg.appendChild(this.dom.clipPath);
        this.dom.svg.appendChild(this.dom.deco);
        this.dom.svg.appendChild(this.dom.image);

        el.appendChild(this.dom.svg);

        //
        // Prepare dom parameters
        //
        this.dom.svg = this.dom.el.querySelector('.blob__svg');
        this.dom.path = this.dom.svg.querySelector('path');

        this.paths = {};
        this.paths.start = this.dom.path.getAttribute('d');

        this.paths.end = Blob.shapeList[shapeID]["morph"];

        this.dom.deco = this.dom.svg.querySelector('.blob__deco');
        this.dom.image = this.dom.svg.querySelector('image');
        this.dom.title = this.dom.el.querySelector('.blob__meta > .blob__title');
        this.dom.subtitle = this.dom.el.querySelector('.blob__meta > .blob__subtitle');
        
        //
        // Animation options
        //
        this.options = {

            // Defaults options
            animation: {
                path: {
                    duration: this.dom.el.dataset.animationPathDuration || 1500,
                    delay: this.dom.el.dataset.animationPathDelay || 0,
                    easing: this.dom.el.dataset.animationPathEasing || 'easeOutElastic',
                    elasticity: this.dom.el.dataset.pathElasticity || 400,
                    scaleX: this.dom.el.dataset.pathScalex || 1,
                    scaleY: this.dom.el.dataset.pathScaley || 1,
                    translateX: this.dom.el.dataset.pathTranslatex || 0,
                    translateY: this.dom.el.dataset.pathTranslatey || 0,
                    rotate: this.dom.el.dataset.pathRotate || 0
                },
                image: {
                    duration: this.dom.el.dataset.animationImageDuration || 2000,
                    delay: this.dom.el.dataset.animationImageDelay || 0,
                    easing: this.dom.el.dataset.animationImageEasing || 'easeOutElastic',
                    elasticity: this.dom.el.dataset.imageElasticity || 400,
                    scaleX: this.dom.el.dataset.imageScalex || 1.1,
                    scaleY: this.dom.el.dataset.imageScaley || 1.1,
                    translateX: this.dom.el.dataset.imageTranslatex || 0,
                    translateY: this.dom.el.dataset.imageTranslatey || 0,
                    rotate: this.dom.el.dataset.imageRotate || 0
                },
                deco: {
                    duration: this.dom.el.dataset.animationDecoDuration || 2500,
                    delay: this.dom.el.dataset.animationDecoDelay || 0,
                    easing: this.dom.el.dataset.animationDecoEasing || 'easeOutQuad',
                    elasticity: this.dom.el.dataset.decoElasticity || 400,
                    scaleX: this.dom.el.dataset.decoScalex || 0.9,
                    scaleY: this.dom.el.dataset.decoScaley || 0.9,
                    translateX: this.dom.el.dataset.decoTranslatex || 0,
                    translateY: this.dom.el.dataset.decoTranslatey || 0,
                    rotate: this.dom.el.dataset.decoRotate || 0
                }
            }
        };

        this.init();
    }

    init() {

        $(this.dom.el).on('mouseenter touchstart', function() {

            this.mouseTimeout = setTimeout(() => {
                this.isActive = true;
                this.hover();
            }, 75);

        }.bind(this));
        $(this.dom.el).on('mouseleave touchend', function() {

            clearTimeout(this.mouseTimeout);
            if( this.isActive ) {
                this.isActive = false;
                this.hover();
            }
        }.bind(this));

        $(this.dom.image).on('click', function() {
            window.location.href = this.dom.el.dataset.href;
        }.bind(this));
    }

    getObject(targetStr) {

        const target = this.dom[targetStr];
        
        let animeOpts = {
            targets: target,
            duration: this.options.animation[targetStr].duration,
            delay: this.options.animation[targetStr].delay,
            easing: this.options.animation[targetStr].easing,
            elasticity: this.options.animation[targetStr].elasticity,	
            scaleX: this.isActive ? this.options.animation[targetStr].scaleX : 1,
            scaleY: this.isActive ? this.options.animation[targetStr].scaleY : 1,
            translateX: this.isActive ? this.options.animation[targetStr].translateX : 0,
            translateY: this.isActive ? this.options.animation[targetStr].translateY : 0,
            rotate: this.isActive ? this.options.animation[targetStr].rotate : 0
        };

        if( targetStr === 'path' ) {
            animeOpts.d = this.isActive ? this.paths.end : this.paths.start;
        }

        anime.remove(target);
        return animeOpts;
    }

    hover() {

        // Animate the path, the image and deco.
        anime(this.getObject('path'));
        anime(this.getObject('image'));
        anime(this.getObject('deco'));

        this.hoverText();
    }

    showText()
    {

    }

    hideText() 
    {

    }

    hoverText()
    {
        // Title animation
        anime.remove(this.dom.title);
        anime({
            targets: this.dom.title,
            easing: 'easeOutQuad',
            translateY: this.isActive ? [
                {value: '-50%', duration: 200},
                {value: ['50%', '0%'], duration: 200}
            ] : [
                {value: '50%', duration: 200},
                {value: ['-50%', '0%'], duration: 200}
            ],
            opacity: [
                {value: 0, duration: 200},
                {value: 1, duration: 200}
            ]
        });
        
        // Subtitle animation
        anime.remove(this.dom.subtitle);
        anime({
            targets: this.dom.subtitle,
            easing: 'easeOutQuad',
            translateY: this.isActive ? {value: ['50%', '0%'], duration: 200, delay: 250} : {value: '0%', duration: 1},
            opacity: this.isActive ? {value: [0,1], duration: 200, delay: 250} : {value: 0, duration: 1}
        });
    }

    unload() {

    }

    load() {

    }

    expand() {

    }

    shrink() {

    }

    static shapeList = {};
    static addShape(id, shape) {

        Blob.shapeList[id] = shape;

        if(shape["deco"] === undefined) return;

        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", shape["deco"]);
            path.setAttribute("id", "shape-deco-"+id);

        var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            defs.append(path);
        
        var svg = $("#shape-decolist")[0] || undefined;
        if (svg === undefined) {

            svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("id", "shape-decolist");
            svg.classList.add("hidden");

            document.body.prepend(svg);
        }

        svg.appendChild(defs);
    }
}


Blob.addShape("toggler", {
	"clip" : "M6.59,391.08c-37.51-139.45,91.58-312,223.34-371.32C317.7-19.76,449,1.14,513.85,72.27c59,64.69,63.79,183.7,23.78,261.57C514.51,378.89,450,384,406.73,410.69c-56.85,34.46-102.36,105.1-169,107.19C150,520.74,29.63,475.8,6.59,391.08Z",
	"morph" : "M 250, 250 m -250, 0 a 250,250 0 1,0 500,0 a 250,250 0 1,0 -500,0"
});
Blob.addShape("blob0", {
	"deco"  : "M 161,54.69 C 230.4,4.986 303.7,8.661 414.4,92.19 465.7,130.9 432.3,211.4 460,279.5 481,331.2 449.7,430.4 381.1,427 287.1,422.3 172.4,503.8 99.27,444.6 21.03,381.1 10.32,258.3 55.25,145.6 73.73,99.3 129.3,77.36 161,54.69 Z",
	"clip" : "M 189,80.37 C 243,66.12 307.3,87.28 350.9,124.1 389.3,156.6 417,211.2 418.1,263.4 419.1,305.7 401.8,355.6 368.5,379.1 298.8,428 179.2,446.4 117.6,386.3 65.4,335.3 78.55,230.3 105.5,160.5 119.7,123.6 152.6,89.85 189,80.37 Z",
	"morph"   : "M 189,80.37 C 232.6,46.67 352.5,67.06 350.9,124.1 349.5,173.4 311.7,168 312.4,248.1 312.9,301.1 382.5,319.2 368.5,379.1 349.4,460.6 137.7,467.5 117.6,386.3 98.68,309.7 171.5,292.2 183.6,240.1 195.7,188.2 123.8,130.7 189,80.37 Z"
});
Blob.addShape("blob1", {
	"deco" : "M 119.8,69.41 C 213.5,18.01 367.2,-1.306 440.4,76.58 482.9,121.9 435.3,200.8 432.9,262.9 431.1,310.6 461.3,372.1 427.7,406 342.4,492 158.3,499.3 64.62,422.5 10.09,377.8 18.76,282.6 32.51,213.5 43.46,158.4 70.61,96.36 119.8,69.41 Z",
	"clip" : "M 378.1,121.2 C 408.4,150 417.2,197.9 411,245.8 404.8,293.7 383.5,341.7 353.4,370.7 303.2,419.1 198.7,427.7 144.5,383.8 86.18,336.5 67.13,221.3 111.9,161 138.6,125 188.9,99.62 240.7,90.92 292.4,82.24 345.6,90.32 378.1,121.2 Z",
	"morph" : "M 418.1,159.8 C 460.9,222.9 497,321.5 452.4,383.4 417.2,432.4 371.2,405.6 271.3,420.3 137.2,440 90.45,500.6 42.16,442.8 -9.572,381 86.33,289.1 117.7,215.5 144.3,153.4 145.7,54.21 212.7,36.25 290.3,15.36 373.9,94.6 418.1,159.8 Z"
});
Blob.addShape("blob2", {
	"deco" : "M 77.03,75.72 C 147.9,0.2308 309,13.37 387.6,80.44 471.8,152.4 517.2,325.6 442.9,407.5 350.2,509.8 43.77,516.2 29.67,378.8 20.48,289.3 80.25,270.4 87.78,212 93.61,166.8 45.85,108.9 77.03,75.72 Z",
	"clip" : "M 184,127.4 C 235.4,92.39 319.7,79.27 359.9,132.2 383.2,163 357.1,216.6 355.8,258.8 354.8,291.2 371.3,332.9 352.9,356 306.1,414.4 205.1,419.3 153.7,367.2 123.8,336.8 128.6,272.1 136.1,225.2 142.1,187.8 157,145.7 184,127.4 Z",
	"morph" : "M 193.7,217.3 C 236.4,228.3 279.7,242.7 320.9,231.8 362.6,220.9 446.8,197.1 457.6,241.5 469.3,289.8 378.7,308.3 330.2,319.2 278.5,330.8 222.3,319.2 172.1,302.2 125.2,286.4 33.08,273.2 45.14,225.2 57.22,177.1 145.7,204.8 193.7,217.3 Z"
});
Blob.addShape("blob3", {
	"deco" : "M 38.35,160.1 C 74.92,86.34 178.1,44.04 260.1,51.51 348.2,59.54 441.6,126.9 473.5,209.4 499.3,276 485,371.9 431.9,419.6 348.2,494.9 185.6,517.4 95.49,449.9 16.71,390.8 -5.393,248.3 38.35,160.1 Z",
	"clip" : "M 402.7,215.5 C 433.9,280.4 488.1,367.2 447.7,426.8 410.1,482.2 316.7,460.2 249.7,460.6 182.8,461.1 88.08,485.5 51.26,429.5 10.29,367.3 73.19,279.4 106.9,213 141.8,144 176.6,33.65 253.9,33.7 332.2,33.75 368.8,144.9 402.7,215.5 Z",
	"morph" : "M 440.9,118.5 C 486.5,189.8 499,297.9 458.3,371.8 422.2,437.2 335.8,475.1 261.5,477.3 181.4,479.6 83.9,445.4 43.22,376.1 -0.2483,302.1 13.51,189.9 61.98,119.1 104.5,56.88 190.6,20.5 265.7,22.71 332.2,24.67 405,62.28 440.9,118.5 Z"
});
Blob.addShape("blob4", {
	"deco" : "M 49.94,386.5 C 9.795,286.4 7.674,129.7 94.72,65.99 188.4,-2.586 371.8,28.99 438.1,124.3 486.9,194.5 503.7,389.2 390.4,376.4 277.1,363.5 238.6,482 155.1,469.7 110.9,463.2 66.57,428 49.94,386.5 Z",
	"clip" : "M 451.5,185.8 C 441.5,266.2 339.6,305 272.3,350.2 207.7,393.6 226.7,444.7 182.6,447.9 132.8,451.4 83.97,399.9 66.37,353.1 34.6,268.4 41.16,141.8 112,85.44 186.1,26.33 313.8,54.1 396,101.4 425.2,118.2 455.6,152.4 451.5,185.8 Z",
	"morph" : "M 368.1,46.42 C 461,96.69 473.7,266.2 422.3,358.4 379.1,436 259.6,484.8 175,457.5 107.5,435.7 12.65,329.8 60.93,277.7 95.18,240.8 154,379.3 194.2,348.9 250.7,306 116,204.1 148.4,140.9 184.8,70.02 298,8.455 368.1,46.42 Z"
});
Blob.addShape("blob5", {
	"deco" : "M 261.7,380.3 C 204.7,399.8 154.1,482.7 98.91,458.5 26.64,426.9 13.2,309.8 29.35,232.6 43.76,163.6 101.4,97.37 167.4,72.34 248,41.97 422.1,-2.762 423.4,107.7 424.6,218.1 507.5,272.4 464.3,336.7 425.7,394.2 327,357.9 261.7,380.3 Z",
	"clip" : "M 274.4,32.13 C 328.5,36.28 249,139.7 287.7,192.8 326.3,245.9 483.3,248.4 459,295 434.9,341.2 341.4,267.6 298,297.5 247.4,332.3 296,461.4 233.9,467.8 177.2,473.8 214.2,326.3 176,268.3 137.8,210.5 24.39,242.4 39.89,189.3 54.21,140.1 142,158.9 184.6,129.2 221.1,103.9 229.3,28.68 274.4,32.13 Z",
	"morph" : "M 279.8,41.26 C 332.2,40.04 397.1,40.63 432.5,79.42 470.9,121.7 455.7,191.8 458.3,249 460.6,300.4 481.9,363.6 448.9,403.1 402.7,458.2 311.1,450.1 239.3,453.9 183.9,456.9 113.3,471.5 74.23,432.1 18.97,376.3 29.82,251.5 45.32,198.4 59.64,149.2 95.01,111.8 134.9,84.73 176.6,56.36 229.4,42.43 279.8,41.26 Z"
});
Blob.addShape("blob6", {
	"deco" : "M 451.9,392.4 C 365.4,455.1 212.9,465.1 131.6,395.9 55.74,331.3 2.509,152.7 87.24,100.3 135.8,70.3 177.8,170.2 227.3,198.6 307.2,244.4 442.2,228.9 478.7,313.5 489.7,339 474.4,376.1 451.9,392.4 Z",
	"clip" : "M 280.1,34.42 C 465.8,29.89 514.6,354 417.3,392.3 318.9,423.2 332.3,114.7 233.3,143.6 134,172.6 294.3,390.5 212,453.2 174.8,481.6 106.3,459.6 74.54,425.3 21.22,367.7 30.13,244.7 45.63,191.6 59.95,142.4 95.32,105 135.2,77.89 176.9,49.52 229.9,29.96 280.1,34.42 Z",
	"morph" : "M 251.1,32.08 C 320.8,39.34 403.4,70.51 435.8,132.7 476.2,210.5 460.8,325.2 406.4,394 360.4,452.2 271,467.5 196.8,469.3 144.1,470.5 65.63,471.7 45.51,423 17.77,355.8 140.2,302.9 148.3,230.6 154.4,177.4 80.17,122.4 106.2,75.55 130.7,31.47 200.9,26.86 251.1,32.08 Z"
});

const blobs = Array.from(document.querySelectorAll('.blob'));
const init = (() => blobs.forEach(blob => new Blob(blob)))();