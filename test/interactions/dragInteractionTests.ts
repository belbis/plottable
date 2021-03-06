///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Interactions", () => {
  describe("Drag", () => {
    var SVG_WIDTH = 400;
    var SVG_HEIGHT = 400;

    var startPoint = {
      x: SVG_WIDTH / 4,
      y: SVG_HEIGHT / 4
    };
    var endPoint = {
      x: SVG_WIDTH / 2,
      y: SVG_HEIGHT / 2
    };

    var outsidePointPos = {
      x: SVG_WIDTH * 1.5,
      y: SVG_HEIGHT * 1.5
    };
    var constrainedPos = {
      x: SVG_WIDTH,
      y: SVG_HEIGHT
    };
    var outsidePointNeg = {
      x: -SVG_WIDTH / 2,
      y: -SVG_HEIGHT / 2
    };
    var constrainedNeg = {
      x: 0,
      y: 0
    };

    it("onDragStart()", () => {
      var svg = generateSVG(SVG_WIDTH, SVG_HEIGHT);
      var c = new Plottable.Component.AbstractComponent();
      c.renderTo(svg);

      var drag = new Plottable.Interaction.Drag();
      var startCallbackCalled = false;
      var receivedStart: Plottable.Point;
      var startCallback = (p: Plottable.Point) => {
        startCallbackCalled = true;
        receivedStart = p;
      };
      drag.onDragStart(startCallback);
      c.registerInteraction(drag);

      var target = c.background();
      triggerFakeMouseEvent("mousedown", target, startPoint.x, startPoint.y);
      assert.isTrue(startCallbackCalled, "callback was called on beginning drag (mousedown)");
      assert.deepEqual(receivedStart, startPoint, "was passed the correct point");

      startCallbackCalled = false;
      receivedStart = null;
      triggerFakeMouseEvent("mousedown", target, startPoint.x, startPoint.y, 2);
      assert.isFalse(startCallbackCalled, "callback is not called on right-click");

      startCallbackCalled = false;
      receivedStart = null;
      triggerFakeTouchEvent("touchstart", target, [{x: startPoint.x, y: startPoint.y}]);
      assert.isTrue(startCallbackCalled, "callback was called on beginning drag (touchstart)");
      assert.deepEqual(receivedStart, startPoint, "was passed the correct point");

      startCallbackCalled = false;
      triggerFakeMouseEvent("mousedown", target, outsidePointPos.x, outsidePointPos.y);
      assert.isFalse(startCallbackCalled, "does not trigger callback if drag starts outside the Component (positive) (mousedown)");
      triggerFakeMouseEvent("mousedown", target, outsidePointNeg.x, outsidePointNeg.y);
      assert.isFalse(startCallbackCalled, "does not trigger callback if drag starts outside the Component (negative) (mousedown)");

      triggerFakeTouchEvent("touchstart", target, [{x: outsidePointPos.x, y: outsidePointPos.y}]);
      assert.isFalse(startCallbackCalled, "does not trigger callback if drag starts outside the Component (positive) (touchstart)");
      triggerFakeTouchEvent("touchstart", target, [{x: outsidePointNeg.x, y: outsidePointNeg.y}]);
      assert.isFalse(startCallbackCalled, "does not trigger callback if drag starts outside the Component (negative) (touchstart)");

      assert.strictEqual(drag.onDragStart(), startCallback, "retrieves the callback if called with no arguments");
      drag.onDragStart(null);
      assert.isNull(drag.onDragStart(), "removes the callback if called with null");
      svg.remove();
    });

    it("onDrag()", () => {
      var svg = generateSVG(SVG_WIDTH, SVG_HEIGHT);
      var c = new Plottable.Component.AbstractComponent();
      c.renderTo(svg);

      var drag = new Plottable.Interaction.Drag();
      var moveCallbackCalled = false;
      var receivedStart: Plottable.Point;
      var receivedEnd: Plottable.Point;
      var moveCallback = (start: Plottable.Point, end: Plottable.Point) => {
        moveCallbackCalled = true;
        receivedStart = start;
        receivedEnd = end;
      };
      drag.onDrag(moveCallback);
      c.registerInteraction(drag);

      var target = c.background();
      triggerFakeMouseEvent("mousedown", target, startPoint.x, startPoint.y);
      triggerFakeMouseEvent("mousemove", target, endPoint.x, endPoint.y);
      assert.isTrue(moveCallbackCalled, "callback was called on dragging (mousemove)");
      assert.deepEqual(receivedStart, startPoint, "was passed the correct starting point");
      assert.deepEqual(receivedEnd, endPoint, "was passed the correct current point");

      receivedStart = null;
      receivedEnd = null;
      triggerFakeTouchEvent("touchstart", target, [{x: startPoint.x, y: startPoint.y}]);
      triggerFakeTouchEvent("touchmove", target, [{x: endPoint.x, y: endPoint.y}]);
      assert.isTrue(moveCallbackCalled, "callback was called on dragging (touchmove)");
      assert.deepEqual(receivedStart, startPoint, "was passed the correct starting point");
      assert.deepEqual(receivedEnd, endPoint, "was passed the correct current point");

      assert.strictEqual(drag.onDrag(), moveCallback, "retrieves the callback if called with no arguments");
      drag.onDrag(null);
      assert.isNull(drag.onDrag(), "removes the callback if called with null");
      svg.remove();
    });

    it("onDragEnd()", () => {
      var svg = generateSVG(SVG_WIDTH, SVG_HEIGHT);
      var c = new Plottable.Component.AbstractComponent();
      c.renderTo(svg);

      var drag = new Plottable.Interaction.Drag();
      var endCallbackCalled = false;
      var receivedStart: Plottable.Point;
      var receivedEnd: Plottable.Point;
      var endCallback = (start: Plottable.Point, end: Plottable.Point) => {
        endCallbackCalled = true;
        receivedStart = start;
        receivedEnd = end;
      };
      drag.onDragEnd(endCallback);
      c.registerInteraction(drag);

      var target = c.background();
      triggerFakeMouseEvent("mousedown", target, startPoint.x, startPoint.y);
      triggerFakeMouseEvent("mouseup", target, endPoint.x, endPoint.y);
      assert.isTrue(endCallbackCalled, "callback was called on drag ending (mouseup)");
      assert.deepEqual(receivedStart, startPoint, "was passed the correct starting point");
      assert.deepEqual(receivedEnd, endPoint, "was passed the correct current point");

      receivedStart = null;
      receivedEnd = null;
      triggerFakeMouseEvent("mousedown", target, startPoint.x, startPoint.y);
      triggerFakeMouseEvent("mouseup", target, endPoint.x, endPoint.y, 2);
      assert.isTrue(endCallbackCalled, "callback was not called on mouseup from the right-click button");
      triggerFakeMouseEvent("mouseup", target, endPoint.x, endPoint.y); // end the drag

      receivedStart = null;
      receivedEnd = null;
      triggerFakeTouchEvent("touchstart", target, [{x: startPoint.x, y: startPoint.y}]);
      triggerFakeTouchEvent("touchend", target, [{x: endPoint.x, y: endPoint.y}]);
      assert.isTrue(endCallbackCalled, "callback was called on drag ending (touchend)");
      assert.deepEqual(receivedStart, startPoint, "was passed the correct starting point");
      assert.deepEqual(receivedEnd, endPoint, "was passed the correct current point");

      assert.strictEqual(drag.onDragEnd(), endCallback, "retrieves the callback if called with no arguments");
      drag.onDragEnd(null);
      assert.isNull(drag.onDragEnd(), "removes the callback if called with null");
      svg.remove();
    });

    it("constrainToComponent()", () => {
      var svg = generateSVG(SVG_WIDTH, SVG_HEIGHT);
      var c = new Plottable.Component.AbstractComponent();
      c.renderTo(svg);

      var drag = new Plottable.Interaction.Drag();
      assert.isTrue(drag.constrainToComponent(), "constrains by default");

      var receivedStart: Plottable.Point;
      var receivedEnd: Plottable.Point;
      var moveCallback = (start: Plottable.Point, end: Plottable.Point) => {
        receivedStart = start;
        receivedEnd = end;
      };
      drag.onDrag(moveCallback);
      var endCallback = (start: Plottable.Point, end: Plottable.Point) => {
        receivedStart = start;
        receivedEnd = end;
      };
      drag.onDragEnd(endCallback);

      c.registerInteraction(drag);
      var target = c.content();

      triggerFakeMouseEvent("mousedown", target, startPoint.x, startPoint.y);
      triggerFakeMouseEvent("mousemove", target, outsidePointPos.x, outsidePointPos.y);
      assert.deepEqual(receivedEnd, constrainedPos, "dragging outside the Component is constrained (positive) (mousemove)");
      triggerFakeMouseEvent("mousemove", target, outsidePointNeg.x, outsidePointNeg.y);
      assert.deepEqual(receivedEnd, constrainedNeg, "dragging outside the Component is constrained (negative) (mousemove)");

      receivedEnd = null;
      triggerFakeTouchEvent("touchmove", target, [{x: outsidePointPos.x, y: outsidePointPos.y}]);
      assert.deepEqual(receivedEnd, constrainedPos, "dragging outside the Component is constrained (positive) (touchmove)");
      triggerFakeTouchEvent("touchmove", target, [{x: outsidePointNeg.x, y: outsidePointNeg.y}]);
      assert.deepEqual(receivedEnd, constrainedNeg, "dragging outside the Component is constrained (negative) (touchmove)");

      receivedEnd = null;
      triggerFakeMouseEvent("mousedown", target, startPoint.x, startPoint.y);
      triggerFakeMouseEvent("mouseup", target, outsidePointPos.x, outsidePointPos.y);
      assert.deepEqual(receivedEnd, constrainedPos, "dragging outside the Component is constrained (positive) (mouseup)");
      triggerFakeMouseEvent("mousedown", target, startPoint.x, startPoint.y);
      triggerFakeMouseEvent("mouseup", target, outsidePointNeg.x, outsidePointNeg.y);
      assert.deepEqual(receivedEnd, constrainedNeg, "dragging outside the Component is constrained (negative) (mouseup)");

      receivedEnd = null;
      triggerFakeTouchEvent("touchstart", target, [{x: startPoint.x, y: startPoint.y}]);
      triggerFakeTouchEvent("touchend", target, [{x: outsidePointPos.x, y: outsidePointPos.y}]);
      assert.deepEqual(receivedEnd, constrainedPos, "dragging outside the Component is constrained (positive) (touchend)");
      triggerFakeTouchEvent("touchstart", target, [{x: startPoint.x, y: startPoint.y}]);
      triggerFakeTouchEvent("touchend", target, [{x: outsidePointNeg.x, y: outsidePointNeg.y}]);
      assert.deepEqual(receivedEnd, constrainedNeg, "dragging outside the Component is constrained (negative) (touchend)");

      drag.constrainToComponent(false);

      triggerFakeMouseEvent("mousedown", target, startPoint.x, startPoint.y);
      triggerFakeMouseEvent("mousemove", target, outsidePointPos.x, outsidePointPos.y);
      assert.deepEqual(receivedEnd, outsidePointPos,
                       "dragging outside the Component is no longer constrained (positive) (mousemove)");
      triggerFakeMouseEvent("mousemove", target, outsidePointNeg.x, outsidePointNeg.y);
      assert.deepEqual(receivedEnd, outsidePointNeg,
                       "dragging outside the Component is no longer constrained (negative) (mousemove)");

      receivedEnd = null;
      triggerFakeTouchEvent("touchmove", target, [{x: outsidePointPos.x, y: outsidePointPos.y}]);
      assert.deepEqual(receivedEnd, outsidePointPos,
                       "dragging outside the Component is no longer constrained (positive) (touchmove)");
      triggerFakeTouchEvent("touchmove", target, [{x: outsidePointNeg.x, y: outsidePointNeg.y}]);
      assert.deepEqual(receivedEnd, outsidePointNeg,
                       "dragging outside the Component is no longer constrained (negative) (touchmove)");

      receivedEnd = null;
      triggerFakeMouseEvent("mousedown", target, startPoint.x, startPoint.y);
      triggerFakeMouseEvent("mouseup", target, outsidePointPos.x, outsidePointPos.y);
      assert.deepEqual(receivedEnd, outsidePointPos,
                       "dragging outside the Component is no longer constrained (positive) (mouseup)");
      triggerFakeMouseEvent("mousedown", target, startPoint.x, startPoint.y);
      triggerFakeMouseEvent("mouseup", target, outsidePointNeg.x, outsidePointNeg.y);
      assert.deepEqual(receivedEnd, outsidePointNeg,
                       "dragging outside the Component is no longer constrained (negative) (mouseup)");

      receivedEnd = null;
      triggerFakeTouchEvent("touchstart", target, [{x: startPoint.x, y: startPoint.y}]);
      triggerFakeTouchEvent("touchend", target, [{x: outsidePointPos.x, y: outsidePointPos.y}]);
      assert.deepEqual(receivedEnd, outsidePointPos,
                       "dragging outside the Component is no longer constrained (positive) (touchend)");
      triggerFakeTouchEvent("touchstart", target, [{x: startPoint.x, y: startPoint.y}]);
      triggerFakeTouchEvent("touchend", target, [{x: outsidePointNeg.x, y: outsidePointNeg.y}]);
      assert.deepEqual(receivedEnd, outsidePointNeg,
                       "dragging outside the Component is no longer constrained (negative) (touchend)");
      svg.remove();
    });

    it("touchcancel cancels the current drag", () => {
      var svg = generateSVG(SVG_WIDTH, SVG_HEIGHT);
      var c = new Plottable.Component.AbstractComponent();
      c.renderTo(svg);

      var drag = new Plottable.Interaction.Drag();
      var moveCallbackCalled = false;
      var receivedStart: Plottable.Point;
      var receivedEnd: Plottable.Point;
      var moveCallback = (start: Plottable.Point, end: Plottable.Point) => {
        moveCallbackCalled = true;
        receivedStart = start;
        receivedEnd = end;
      };
      drag.onDrag(moveCallback);
      c.registerInteraction(drag);

      var target = c.background();
      receivedStart = null;
      receivedEnd = null;
      triggerFakeTouchEvent("touchstart", target, [{x: startPoint.x, y: startPoint.y}]);
      triggerFakeTouchEvent("touchmove", target, [{x: endPoint.x - 10, y: endPoint.y - 10}]);
      triggerFakeTouchEvent("touchcancel", target, [{x: endPoint.x - 10, y: endPoint.y - 10}]);
      triggerFakeTouchEvent("touchmove", target, [{x: endPoint.x, y: endPoint.y}]);
      assert.notEqual(receivedEnd, endPoint, "was not passed touch point after cancelled");

      svg.remove();
    });
  });
});
