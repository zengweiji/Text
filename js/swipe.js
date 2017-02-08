function Swipe(k, e) {
    var f = function() {};
    var s = function(A) {
        setTimeout(A || f, 0)
    };
    var z = {
        addEventListener: !!window.addEventListener,
        touch: ("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch,
        transitions: (function(A) {
            var C = ["transformProperty", "WebkitTransform", "MozTransform", "OTransform", "msTransform"];
            for (var B in C) {
                if (A.style[C[B]] !== undefined) {
                    return true
                }
            }
            return false
        })(document.createElement("swipe"))
    };
    if (!k) {
        return
    }
    var c = k.children[0];
    var q, d, p;
    e = e || {};
    var i = parseInt(e.startSlide, 10) || 0;
    var t = e.speed || 300;
    e.continuous = e.continuous ? e.continuous: true;
    function l() {
        q = c.children;
        d = new Array(q.length);
        p = k.getBoundingClientRect().width || k.offsetWidth;
        c.style.width = (q.length * p) + "px";
        var B = q.length;
        while (B--) {
            var A = q[B];
            A.style.width = p + "px";
            A.setAttribute("data-index", B);
            if (z.transitions) {
                A.style.left = (B * -p) + "px";
                o(B, i > B ? -p: (i < B ? p: 0), 0)
            }
        }
        if (!z.transitions) {
            c.style.left = (i * -p) + "px"
        }
        k.style.visibility = "visible"
    }
    function m() {
        if (i) {
            a(i - 1)
        } else {
            if (e.continuous) {
                a(q.length - 1)
            }
        }
    }
    function n() {
        if (i < q.length - 1) {
            a(i + 1)
        } else {
            if (e.continuous) {
                a(0)
            }
        }
    }
    function a(D, A) {
        if (i == D) {
            return
        }
        if (z.transitions) {
            var C = Math.abs(i - D) - 1;
            var B = Math.abs(i - D) / (i - D);
            while (C--) {
                o((D > i ? D: i) - C - 1, p * B, 0)
            }
            o(i, p * B, A || t);
            o(D, 0, A || t)
        } else {
            h(i * -p, D * -p, A || t)
        }
        i = D;
        s(e.callback && e.callback(i, q[i]))
    }
    function o(A, C, B) {
        j(A, C, B);
        d[A] = C
    }
    function j(B, E, D) {
        var A = q[B];
        var C = A && A.style;
        if (!C) {
            return
        }
        C.webkitTransitionDuration = C.MozTransitionDuration = C.msTransitionDuration = C.OTransitionDuration = C.transitionDuration = D + "ms";
        C.webkitTransform = "translate(" + E + "px,0)" + "translateZ(0)";
        C.msTransform = C.MozTransform = C.OTransform = "translateX(" + E + "px)"
    }
    function h(E, D, A) {
        if (!A) {
            c.style.left = D + "px";
            return
        }
        var C = +new Date;
        var B = setInterval(function() {
            var F = +new Date - C;
            if (F > A) {
                c.style.left = D + "px";
                if (y) {
                    v()
                }
                e.transitionEnd && e.transitionEnd.call(event, i, q[i]);
                clearInterval(B);
                return
            }
            c.style.left = (((D - E) * (Math.floor((F / A) * 100) / 100)) + E) + "px"
        },
        4)
    }
    var y = e.auto || 0;
    var u;
    function v() {
        u = setTimeout(n, y)
    }
    function r() {
        y = 0;
        y = e.auto > 0 ? e.auto: 0;
        clearTimeout(u)
    }
    var g = {};
    var w = {};
    var x;
    var b = {
        handleEvent: function(A) {
            switch (A.type) {
            case "touchstart":
                this.start(A);
                break;
            case "touchmove":
                this.move(A);
                break;
            case "touchend":
                s(this.end(A));
                break;
            case "webkitTransitionEnd":
            case "msTransitionEnd":
            case "oTransitionEnd":
            case "otransitionend":
            case "transitionend":
                s(this.transitionEnd(A));
                break;
            case "resize":
                s(l.call());
                break
            }
            if (e.stopPropagation) {
                A.stopPropagation()
            }
        },
        start: function(A) {
            var B = A.touches[0];
            g = {
                x: B.pageX,
                y: B.pageY,
                time: +new Date
            };
            x = undefined;
            w = {};
            c.addEventListener("touchmove", this, false);
            c.addEventListener("touchend", this, false)
        },
        move: function(A) {
            if (A.touches.length > 1 || A.scale && A.scale !== 1) {
                return
            }
            if (e.disableScroll) {
                A.preventDefault()
            }
            var B = A.touches[0];
            w = {
                x: B.pageX - g.x,
                y: B.pageY - g.y
            };
            if (typeof x == "undefined") {
                x = !!(x || Math.abs(w.x) < Math.abs(w.y))
            }
            if (!x) {
                A.preventDefault();
                r();
                w.x = w.x / ((!i && w.x > 0 || i == q.length - 1 && w.x < 0) ? (Math.abs(w.x) / p + 1) : 1);
                j(i - 1, w.x + d[i - 1], 0);
                j(i, w.x + d[i], 0);
                j(i + 1, w.x + d[i + 1], 0)
            }
        },
        end: function(C) {
            var E = +new Date - g.time;
            var B = Number(E) < 250 && Math.abs(w.x) > 20 || Math.abs(w.x) > p / 2;
            var A = !i && w.x > 0 || i == q.length - 1 && w.x < 0;
            var D = w.x < 0;
            if (!x) {
                if (B && !A) {
                    if (D) {
                        o(i - 1, -p, 0);
                        o(i, d[i] - p, t);
                        o(i + 1, d[i + 1] - p, t);
                        i += 1
                    } else {
                        o(i + 1, p, 0);
                        o(i, d[i] + p, t);
                        o(i - 1, d[i - 1] + p, t);
                        i += -1
                    }
                    e.callback && e.callback(i, q[i])
                } else {
                    o(i - 1, -p, t);
                    o(i, 0, t);
                    o(i + 1, p, t)
                }
            }
            c.removeEventListener("touchmove", b, false);
            c.removeEventListener("touchend", b, false)
        },
        transitionEnd: function(A) {
            if (parseInt(A.target.getAttribute("data-index"), 10) == i) {
                if (y) {
                    v()
                }
                e.transitionEnd && e.transitionEnd.call(A, i, q[i])
            }
        }
    };
    l();
    if (y) {
        v()
    }
    if (z.addEventListener) {
        if (z.touch) {
            c.addEventListener("touchstart", b, false)
        }
        if (z.transitions) {
            c.addEventListener("webkitTransitionEnd", b, false);
            c.addEventListener("msTransitionEnd", b, false);
            c.addEventListener("oTransitionEnd", b, false);
            c.addEventListener("otransitionend", b, false);
            c.addEventListener("transitionend", b, false)
        }
        window.addEventListener("resize", b, false)
    } else {
        window.onresize = function() {
            l()
        }
    }
    return {
        setup: function() {
            l()
        },
        slide: function(B, A) {
            a(B, A)
        },
        prev: function() {
            r();
            m()
        },
        next: function() {
            r();
            n()
        },
        getPos: function() {
            return i
        },
        kill: function() {
            r();
            c.style.width = "auto";
            c.style.left = 0;
            var B = q.length;
            while (B--) {
                var A = q[B];
                A.style.width = "100%";
                A.style.left = 0;
                if (z.transitions) {
                    j(B, 0, 0)
                }
            }
            if (z.addEventListener) {
                c.removeEventListener("touchstart", b, false);
                c.removeEventListener("webkitTransitionEnd", b, false);
                c.removeEventListener("msTransitionEnd", b, false);
                c.removeEventListener("oTransitionEnd", b, false);
                c.removeEventListener("otransitionend", b, false);
                c.removeEventListener("transitionend", b, false);
                window.removeEventListener("resize", b, false)
            } else {
                window.onresize = null
            }
        }
    }
}
if (window.jQuery || window.Zepto) { (function(a) {
        a.fn.Swipe = function(b) {
            return this.each(function() {
                a(this).data("Swipe", new Swipe(a(this)[0], b))
            })
        }
    })(window.jQuery || window.Zepto)
};