import {
  GeometryElement,
  Point,
  Polygon,
  Segment,
  Vector,
  createPolygonFromCoordinates,
} from "./geometry"

describe("GeometryElement", () => {
  it("can't be instantiated on its own", () => {
    const buildAGO = () => new GeometryElement()
    expect(() => buildAGO()).toThrow(TypeError)
  })
})

describe("Point object", () => {
  describe("constructor", () => {
    it("returns a point object from value", () => {
      const p = new Point(1, 5)
      expect(p.x).toEqual(1)
      expect(p.y).toEqual(5)
    })

    it("returns a point at 0, 0 when no args is provided", () => {
      const p = new Point()
      expect(p.x).toEqual(0)
      expect(p.y).toEqual(0)
    })
  })

  it("toString() method: displays a string with x and y", () => {
    const p = new Point(1, 5)
    expect(p.toString()).toEqual("{ x: 1, y: 5 }")
  })

  describe("add()", () => {
    it("add points and return a new instance", () => {
      const p = new Point(2, 0)
      const p2 = new Point(0, 1)
      const p3 = p.add(p2)
      expect(p.x).toEqual(2)
      expect(p.y).toEqual(0)
      expect(p2.x).toEqual(0)
      expect(p2.y).toEqual(1)
      expect(p3.x).toEqual(2)
      expect(p3.y).toEqual(1)
    })

    it("add points and return a new instance without second point", () => {
      const p = new Point(2, 0)
      const p3 = p.add(new Point())
      expect(p.x).toEqual(2)
      expect(p.y).toEqual(0)
      expect(p3.x).toEqual(2)
      expect(p3.y).toEqual(0)
    })
  })

  describe("subtract()", () => {
    it("subtract(): subtract points and return a new instance", () => {
      const p = new Point(2, 0)
      const p2 = new Point(0, 1)
      const p3 = p.subtract(p2)
      expect(p.x).toEqual(2)
      expect(p.y).toEqual(0)
      expect(p2.x).toEqual(0)
      expect(p2.y).toEqual(1)
      expect(p3.x).toEqual(2)
      expect(p3.y).toEqual(-1)
    })

    it("subtract(): subtract points and return a new instance without second point", () => {
      const p = new Point(2, 0)
      const p2 = p.subtract(new Point())
      expect(p.x).toEqual(2)
      expect(p.y).toEqual(0)
      expect(p2.x).toEqual(2)
      expect(p2.y).toEqual(0)
    })
  })

  describe("translate()", () => {
    it("translate point with one factor", () => {
      const point = new Point()
      expect(point.translate(1).equal(new Point(1, 1))).toBeTruthy()
    })

    it("translate point with two factor", () => {
      const point = new Point()
      expect(point.translate(1, 2).equal(new Point(1, 2))).toBeTruthy()
    })
  })

  describe("distance()", () => {
    it("computes the distance between 2 points", () => {
      const p = new Point(3, 0)
      const p2 = new Point(0, 4)
      const d = p.distance(p2)
      expect(d).toEqual(5)
    })

    it("computes the distance between 2 points event without a second point", () => {
      const p = new Point(3, 0)
      expect(p.distance()).toEqual(3)
      const p2 = new Point(1, 1)
      expect(p2.distance()).toEqual(Math.sqrt(2))
    })
  })

  it("clone(): clones a point", () => {
    const p = new Point()
    const clone = p.clone()
    expect(p === clone).toBeFalsy()
    expect(p.x === clone.x).toBeTruthy()
    expect(p.y === clone.y).toBeTruthy()
  })

  describe("equal()", () => {
    it("checks for object equality", () => {
      const p = new Point()
      expect(p.equal(p)).toBeTruthy()
    })

    it("checks for coordinates equality", () => {
      const p = new Point()
      const clone = p.clone()
      expect(p.equal(clone)).toBeTruthy()
    })

    it("checks for coordinates equality", () => {
      const p = new Point()
      const p2 = new Point(1, 1)
      expect(p.equal(p2)).toBeFalsy()
    })

    it("checks for coordinates with Array same coordinates", () => {
      const p = new Point()
      const p2 = [1, 1]
      expect(p.equal(p2)).toBeFalsy()
    })

    it("checks for coordinates with Array different coordinates", () => {
      const p = new Point()
      const p2 = new Point(0, 0)
      expect(p.equal(p2)).toBeTruthy()
    })
  })

  it("toList() method return a list", () => {
    const p = new Point(1, 2)
    expect(p.toList()).toEqual([1, 2])
  })

  it("scale() method returns a scale Point", () => {
    const p = new Point(1, 2)
    const p2 = p.scale(2)
    expect(p2).toEqual(new Point(2, 4))
  })

  describe("unscale()", () => {
    it("unscale with factor 0 returns original point", () => {
      const point = new Point(5, 5)
      expect(point.unscale(0).equal(new Point(5, 5))).toBeTruthy()
    })

    it("unscale with one factor", () => {
      const point = new Point(5, 5)
      expect(point.unscale(5).equal(new Point(1, 1))).toBeTruthy()
    })

    it("unscale with two factor", () => {
      const point = new Point(2, 3)
      expect(point.unscale(2, 3).equal(new Point(1, 1))).toBeTruthy()
    })
  })

  describe("divide", () => {
    it("divide with one factor", () => {
      const p1 = new Point(0.5, 0)
      const p2 = p1.divide(2)
      expect(p2.equal(new Point(0.25, 0))).toBeTruthy()
    })

    it("divide with two factors", () => {
      const p1 = new Point(0.5, 1)
      const p2 = p1.divide(-2, 5)
      expect(p2.equal(new Point(-0.25, 0.2))).toBeTruthy()
    })

    it("returns unchanged points with if one factor is 0", () => {
      const p1 = new Point(0.5, 1)
      const p2 = p1.divide(0)
      expect(p2.equal(p1)).toBeTruthy()
    })
  })

  it("toInt, round points coordinates to avoid float positionning", () => {
    const point = new Point(123.45, 567.89)
    expect(point.toInt().toList()).toEqual([123, 568])
  })

  it("squareNorm(): returns the square norm of the segment", () => {
    const s1 = new Vector()
    expect(s1.squareNorm()).toEqual(0)
    const s2 = new Vector(1, 1)
    expect(s2.squareNorm()).toEqual(2)
  })

  it("angle", () => {
    const p1 = new Point(1, 0)
    const p2 = new Point(1, 1)
    expect(p1.angle(p2)).toEqual(Math.PI / 4)
  })
})

describe("Vector", () => {
  it("constructor(): creates a vector", () => {
    const v = new Vector()
    expect(v.x).toEqual(0)
  })

  it("inherits methods from GeometryElement", () => {
    const v = new Vector()
    const v2 = v.add(new Vector())
    expect(v2).toEqual(v)
  })

  describe("crossProduct()", () => {
    it("crossProduct(): cross product between colinear vectors is 0", () => {
      const v1 = new Vector(1, 0)
      const v2 = new Vector(5, 0)
      expect(v1.crossProduct(v2)).toEqual(0)
    })

    it("crossProduct(): cross product between vectors with a 0 norm vector is 0", () => {
      const v1 = new Vector(1, 0)
      const v2 = new Vector(0, 0)
      expect(v1.crossProduct(v2)).toEqual(0)
    })

    it("crossProduct(): cross product between vectors with opposite direction is 0", () => {
      const v1 = new Vector(1, 1)
      const v2 = new Vector(-1, -1)
      expect(v1.crossProduct(v2)).toEqual(0)
    })

    it("crossProduct(): compute the cross product between non ortho segments", () => {
      const v1 = new Vector(1, 1)
      const v2 = new Vector(-1, 1)
      expect(v1.crossProduct(v2)).toEqual(2)
    })
  })

  describe("scalarProduct", () => {
    it("return 0 for ortho", () => {
      const v1 = new Vector(1, 0)
      const v2 = new Vector(0, 1)
      expect(v1.scalarProduct(v2)).toEqual(0)
    })

    it("return not 0 for non ortho", () => {
      const v1 = new Vector(1, 0)
      const v2 = new Vector(1, 1)
      expect(v1.scalarProduct(v2)).toEqual(1)
    })
  })
})

describe("Segment", () => {
  it("constructor(): creates a segment", () => {
    const from = new Point()
    const to = new Point()
    const s = new Segment(from, to)
    expect(s.from).toEqual(from)
    expect(s.to).toEqual(to)
    expect(s.vector).toBeDefined()
    expect(s.diff).toBeDefined()
  })

  it("constructor(): creates a segment without points", () => {
    const s = new Segment()
    expect(s.from.equal(new Point())).toBeTruthy()
    expect(s.to.equal(new Point())).toBeTruthy()
  })

  describe("intersects() method", () => {
    const from = new Point(0, 0)
    const to = new Point(0, 1)
    const s1 = new Segment(from, to)

    it("returns false for colinear arrays", () => {
      const from2 = new Point(1, 0)
      const to2 = new Point(1, 1)
      const s2 = new Segment(from2, to2)
      expect(s1.intersects(s2)).toBeFalsy()
    })

    it("returns true for colinear and overlapping arrays", () => {
      const from2 = new Point(0, 0)
      const to2 = new Point(2000, 0)
      const s2 = new Segment(from2, to2)
      expect(s1.intersects(s2)).toBeTruthy()
    })

    it("returns true for colinear array but common point", () => {
      const to2 = new Point(0, 2)
      const s2 = new Segment(from, to2)
      expect(s1.intersects(s2)).toBeTruthy()
    })

    it("returns true for colinear arrays but equal", () => {
      const s2 = new Segment(from, to)
      expect(s1.intersects(s2)).toBeTruthy()
    })

    it("returns true for non colinear segment sharing one point", () => {
      const s2 = new Segment(undefined, new Point(0, -1))
      expect(s1.intersects(s2)).toBeTruthy()
    })

    it("returns true for colinear segments, no common points but overlapping", () => {
      const from2 = new Point(0, 1.5)
      const to2 = new Point(0, 0.5)
      const s2 = new Segment(from2, to2)
      const from = new Point(0, 0)
      const to = new Point(0, 1)
      const s1 = new Segment(from, to)
      expect(s1.intersects(s2)).toBeTruthy()
    })

    it("returns true for colinear array but common part", () => {
      const from2 = new Point(0, 0.5)
      const to2 = new Point(0, 1)
      const s2 = new Segment(from2, to2)
      expect(s1.intersects(s2)).toBeTruthy()
    })

    it("returns true for intersecting array", () => {
      const from2 = new Point(1, 0)
      const to2 = new Point(0, 1)
      const s2 = new Segment(from2, to2)
      const from3 = new Point()
      const to3 = new Point(1, 1)
      const s3 = new Segment(from3, to3)
      expect(s3.intersects(s2)).toBeTruthy()
    })

    it("returns false for vertical and horizontal without intersection or common points", () => {
      const from2 = new Point(0.5, 0.5)
      const to2 = new Point(1.5, 0.5)
      const s2 = new Segment(from2, to2)
      const from3 = new Point()
      const to3 = new Point(0, 1)
      const s3 = new Segment(from3, to3)
      expect(s3.intersects(s2)).toBeFalsy()
    })
  })

  describe("project()", () => {
    it("returns undefined for null direction", () => {
      const segment = new Segment()
      const point = new Point(1, 1)
      expect(segment.project(point).equal(new Point())).toBeTruthy()
    })

    it("returns point with direction on x axis", () => {
      const segment = new Segment(new Point(), new Point(1))
      const point = new Point(0.2, 0.2)
      expect(segment.project(point).equal(new Point(0.2, 0))).toBeTruthy()
    })

    it("returns point with direction (1, 1)", () => {
      const segment = new Segment(new Point(), new Point(1, 1))
      const point = new Point(0, 0.2)
      expect(segment.project(point).equal(new Point(0.1, 0.1))).toBeTruthy()
    })

    it("returns point with direction (1, 1) with offset for vect", () => {
      const segment = new Segment(new Point(1, 1), new Point(2, 2))
      const point = new Point(0, 0.2)
      expect(segment.project(point).equal(new Point(0.1, 0.1))).toBeTruthy()
    })

    it("returns point with direction (1, -1) with offset for vect", () => {
      const segment = new Segment(new Point(0.6, 0.6), new Point(0.7, 0.5))
      const point = new Point(0.6, 0.4)
      expect(segment.project(point).equal(new Point(0.7, 0.5))).toBeTruthy()
    })
  })
})

describe("Polygon", () => {
  it("constructor", () => {
    const p1 = new Point()
    const p2 = new Point()
    const p3 = new Point()
    const poly = new Polygon([p1, p2, p3])
    expect(poly.points[0].equal(p1)).toBeTruthy()
  })

  describe("clone()", () => {
    const p1 = new Point()
    const p2 = new Point()
    const p3 = new Point()
    const poly = new Polygon([p1, p2, p3], true, true, { foo: "bar" })
    const newPoly = poly.clone()
    expect(newPoly.extra.foo).toEqual("bar")
  })

  it("width property", () => {
    const poly = new Polygon([
      new Point(0, 0.5),
      new Point(0.5, 1),
      new Point(1, 0.5),
      new Point(0.5, 0),
    ])
    expect(poly.width).toEqual(1)
  })

  it("height property", () => {
    const poly = new Polygon([
      new Point(0, 0.5),
      new Point(0.5, 1),
      new Point(1, 0.5),
      new Point(0.5, 0),
    ])
    expect(poly.height).toEqual(1)
  })

  describe("toString()", () => {
    it("outputs infos with empty extra", () => {
      const p1 = new Point()
      const p2 = new Point()
      const poly = new Polygon([p1, p2])
      expect(poly.toString()).toEqual(
        "Polygon - points [{ x: 0, y: 0 },{ x: 0, y: 0 }] - extra: {}"
      )
    })

    it("outputs infos with extra", () => {
      const p1 = new Point()
      const p2 = new Point()
      const poly = new Polygon([p1, p2], false, false, { foo: "bar" })
      expect(poly.toString()).toEqual(
        'Polygon - points [{ x: 0, y: 0 },{ x: 0, y: 0 }] - extra: {"foo":"bar"}'
      )
    })
  })

  it("toList()", () => {
    const p1 = new Point()
    const p2 = new Point()
    const poly = new Polygon([p1, p2])
    expect(poly.toList()).toEqual([p1.toList(), p2.toList()])
  })

  it("translate()", () => {
    const p1 = new Point()
    const p2 = new Point()
    const poly = new Polygon([p1, p2])
    const dx = 1
    const dy = 1
    expect(poly.translate(dx, dy).points).toEqual([
      p1.add(new Point(dx, dy)),
      p2.add(new Point(dx, dy)),
    ])
  })

  describe("safeTranslate()", () => {
    it("does not translate if poly outside of 0-1 boundary", () => {
      const p1 = new Point(0.1, 0.1)
      const p2 = new Point(1, 1)
      const poly = new Polygon([p1, p2])
      const dx = 0.1
      const dy = 0.1
      expect(poly.safeTranslate(dx, dy).points).toEqual([p1, p2])
    })

    it("translates normally if poly is contained in 0-1 boundary", () => {
      const p1 = new Point(0.1, 0.1)
      const p2 = new Point(0.8, 0.8)
      const poly = new Polygon([p1, p2])
      const dx = 0.1
      const dy = 0.1
      expect(poly.safeTranslate(dx, dy).points).toEqual([
        new Point(0.2, 0.2),
        new Point(0.9, 0.9),
      ])
    })
  })

  it("add(): adds point to the list of points", () => {
    const poly = new Polygon()
    const newPoly = poly.add(new Point())
    expect(newPoly.points.length).toEqual(1)
  })

  it("remove(): removes point to the list of points", () => {
    const p = new Point()
    const poly = new Polygon([p])
    const newPoly = poly.remove(0)
    expect(newPoly.points.length).toEqual(0)
  })

  it("sanitizePoints()", () => {
    const p1 = new Point(0.555555, -10)
    const p2 = new Point(1, 2.36441)
    const poly = new Polygon([p1, p2])
    expect(poly.sanitizePoints().toList()).toEqual([
      [0.5556, 0],
      [1, 1],
    ])
  })

  describe("scale()", () => {
    it("scale with one factor", () => {
      const p1 = new Point(0.5, 0)
      const p2 = new Point(1, 0.5)
      const poly = new Polygon([p1, p2])
      expect(poly.scale(2).points[0].equal(new Point(1, 0))).toBeTruthy()
    })

    it("scale with two factors", () => {
      const p1 = new Point(0.5, 0)
      const p2 = new Point(1, 0.5)
      const poly = new Polygon([p1, p2])
      expect(poly.scale(-2, 5).points[1].equal(new Point(-2, 2.5))).toBeTruthy()
    })
  })

  describe("unscale()", () => {
    it("does nothing if factor is 0", () => {
      const poly = new Polygon([new Point(10, 10), new Point(15, 15)])
      expect(poly.unscale(0).points[0].equal(new Point(10, 10))).toBeTruthy()
    })

    it("unscale with one factor", () => {
      const poly = new Polygon([new Point(10, 10), new Point(15, 15)])
      expect(poly.unscale(5).points[0].equal(new Point(2, 2))).toBeTruthy()
      expect(poly.unscale(5).points[1].equal(new Point(3, 3))).toBeTruthy()
    })

    it("unscale with two factors", () => {
      const poly = new Polygon([new Point(10, 10), new Point(15, 15)])
      expect(poly.unscale(10, 5).points[0].equal(new Point(1, 2))).toBeTruthy()
      expect(
        poly.unscale(10, 5).points[1].equal(new Point(1.5, 3))
      ).toBeTruthy()
    })
  })

  it("length property", () => {
    const p1 = new Point(0.5, 0)
    const p2 = new Point(1, 0.5)
    const poly = new Polygon([p1, p2])
    expect(poly.length).toEqual(2)
  })

  describe("contains()", () => {
    it("indicates if the point is outside the given shape (square)", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] // 1-square
      const point = new Point(5, 5)
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.contains(point)).toBeFalsy()
    })

    it("indicates if the point is inside the given shape (square)", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] // 1-square
      const point = new Point(0.5, 0.5)
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.contains(point)).toBeTruthy()
    })

    it("indicates if the point is inside the given shape (square) with multiple intersection", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] // 1-square
      const point = new Point(-1, -1)
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.contains(point)).toBeFalsy()
    })

    it("indicates if the point is outside the given shape (triangle)", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [0.5, 1],
      ] // triangle
      const point = new Point(0.5, 0.5)
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.contains(point)).toBeTruthy()
    })

    it("indicates if the point is outside zone even with flat lines (external point)", () => {
      const shape = [
        [1, 0],
        [2, 0],
        [1.5, 1],
      ] // triangle
      const point = new Point(0, 0)
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.contains(point)).toBeFalsy()
    })

    it("indicates if the point is outside zone even with flat lines (point on edge)", () => {
      const shape = [
        [1, 0],
        [2, 0],
        [1.5, 1],
      ] // triangle
      const point = new Point(1, 0)
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.contains(point)).toBeTruthy()
    })
  })

  describe("intersects()", () => {
    it("returns false when no intersection occurs", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] // 1-square
      const segment = new Segment(new Point(0.9, 0.9), new Point(0.5, 0.5))
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.intersects(segment)).toBeFalsy()
    })

    it("returns true when an intersection occurs", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] // 1-square
      const segment = new Segment(
        new Point(...shape[shape.length - 1]),
        new Point(0.5, -1)
      )
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.intersects(segment)).toBeTruthy()
    })

    it("returns true when an intersection occurs with exclude", () => {
      const shape = [
        [0, 0],
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] // 1-square
      const segment = new Segment(
        new Point(...shape[shape.length - 1]),
        new Point(0.5, -1)
      )
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.intersects(segment, 0)).toBeTruthy()
    })
  })

  describe("intersectsItselfWithUpdatedPoint(): intersects itself if closed", () => {
    it("returns truthy if new shape got an intersection", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] // 1-square
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(
        poly.intersectsItselfWithUpdatedPoint(new Point(0.5, 1.1))
      ).toBeTruthy()
    })

    it("returns falsy if new shape got no intersection", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] // 1-square
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(
        poly.intersectsItselfWithUpdatedPoint(new Point(0.5, 0.5), 0)
      ).toBeFalsy()
    })
  })

  describe("intersectsWithNewLine(): intersects with new line", () => {
    it("returns false if new line does not lead to intersection", () => {
      const poly = new Polygon([new Point(), new Point(0, 1)])
      expect(poly.intersectsWithNewLine(new Point(1, 1))).toBeFalsy()
    })

    it("returns true if new line leads to an intersection", () => {
      const poly = new Polygon([
        new Point(1, 1),
        new Point(2, 1),
        new Point(1.5, 2),
      ])
      expect(poly.intersectsWithNewLine(new Point(1.5, 0))).toBeTruthy()
    })
  })

  describe("getClosestPointIndex()", () => {
    it("returns index of the closest point (distance wise)", () => {
      const poly = new Polygon([
        new Point(0, 0),
        new Point(0.5, 1),
        new Point(1, 0),
      ])
      expect(poly.getClosestPointIndex(new Point(0.45, 0.8))).toEqual(1)
    })
  })

  describe("pop()", () => {
    it("removes last point", () => {
      const poly = new Polygon([new Point()])
      const newPoly = poly.pop()
      expect(newPoly.length).toEqual(0)
    })
  })

  describe("toRelative()", () => {
    it("applies offset and scales down coordinates to be between 0 and 1", () => {
      const poly = new Polygon([
        new Point(1, 1),
        new Point(6, 6),
        new Point(6, 1),
      ])
      const imageBoundingBox = [1, 1, 10, 10]
      expect(
        poly.toRelative(imageBoundingBox).points[0].equal(new Point(0, 0))
      ).toBeTruthy()
      expect(
        poly.toRelative(imageBoundingBox).points[1].equal(new Point(0.5, 0.5))
      ).toBeTruthy()
    })
  })

  describe("scaleToImage()", () => {
    it("applies offset and scales up for canvas drawing", () => {
      const poly = new Polygon([
        new Point(0, 0),
        new Point(0.5, 0.5),
        new Point(0.5, 0),
      ])
      const imageBoundingBox = [1, 1, 10, 10]
      expect(
        poly.scaleToImage(imageBoundingBox).points[0].equal(new Point(1, 1))
      ).toBeTruthy()
      expect(
        poly.scaleToImage(imageBoundingBox).points[1].equal(new Point(6, 6))
      ).toBeTruthy()
    })
  })

  describe("canBeClosed()", () => {
    it("returns false if we have two points or less", () => {
      const onePointShape = new Polygon([new Point()])
      expect(onePointShape.canBeClosed()).toBeFalsy()
      const twoPointsShape = new Polygon([new Point(), new Point(1, 1)])
      expect(twoPointsShape.canBeClosed()).toBeFalsy()
    })

    it("returns true if we have more than two points and no intersection", () => {
      const threePointsShape = new Polygon([
        new Point(),
        new Point(1, 1),
        new Point(1, 0),
      ])
      expect(threePointsShape.canBeClosed()).toBeTruthy()
    })

    it("returns false if we have more than two points and at least one intersection", () => {
      const fourPointsShape = new Polygon([
        new Point(),
        new Point(1, 1),
        new Point(1, 0),
        new Point(1.1, 0.5),
      ])
      expect(fourPointsShape.canBeClosed()).toBeFalsy()
    })
  })

  describe("getSelectedPointIndex", () => {
    it("returns undefined when no points", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] // 1-square
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.getSelectedPointIndex(new Point(100, 100))).toBe(undefined)
    })

    it("returns index when no points", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] // 1-square
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.getSelectedPointIndex(new Point(0, 0))).toEqual(0)
    })
  })

  describe("computeCenter", () => {
    it("1-square center", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] // 1-square
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.computeCenter().equal(new Point(0.5, 0.5))).toBeTruthy()
    })

    it("1-triangle center", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [0.5, 1],
      ] // 1-triangle
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.computeCenter().equal(new Point(0.5, 0.3333))).toBeTruthy()
    })

    it("l-shape center", () => {
      const shape = [
        [0, 0],
        [0, 1],
        [0.1, 1],
        [0.1, 0.1],
        [1, 0.1],
        [1, 0],
      ] // l-shape
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.computeCenter().equal(new Point(0.3667, 0.3667))).toBeTruthy()
    })
  })

  describe("gravityCenter", () => {
    it("1-square center", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] // 1-square
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(
        poly.computeGravityCenter().equal(new Point(0.5, 0.5))
      ).toBeTruthy()
    })

    it("1-triangle center", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [0.5, 1],
      ] // 1-triangle
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(
        poly.computeGravityCenter().equal(new Point(0.5, 0.3333))
      ).toBeTruthy()
    })

    it("l-shape center", () => {
      const lshape = [
        [0, 0],
        [0, 1],
        [0.1, 1],
        [0.1, 0.1],
        [1, 0.1],
        [1, 0],
      ] // l-shape
      const poly = new Polygon(lshape.map(([x, y]) => new Point(x, y)))
      expect(
        poly.computeGravityCenter().equal(new Point(0.2868, 0.2868))
      ).toBeTruthy()
    })

    it("irregular polygon", () => {
      const shape = [
        [-0.1, 0.2],
        [0.7, 0.5],
        [0.4, 0.3],
        [0.6, -0.1],
        [0.3, 0.1],
      ]
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(
        poly.computeGravityCenter().equal(new Point(0.3167, 0.2056))
      ).toBeTruthy()
    })
  })

  describe("rotate", () => {
    it("1-square center Pi/4", () => {
      const scalingFactor = [1, 1]
      const shape = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] // 1-square
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      // No action because out of 1-length square
      expect(
        poly.rotate(Math.PI / 4, scalingFactor).points[0].equal(new Point())
      ).toBeTruthy()
    })

    it("1-square with offset 1, 1. rotation Pi/2", () => {
      const scalingFactor = [10, 10]
      const shape = [
        [1, 1],
        [2, 1],
        [2, 2],
        [1, 2],
      ] // 1-square
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      const newPoly = poly.rotate(Math.PI / 4, scalingFactor)
      // No action because out of 1-length square
      expect(newPoly.points[0].equal(new Point(1, 1))).toBeTruthy()
    })

    it("1-square center Pi/2", () => {
      const scalingFactor = [1, 1]
      const shape = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] // 1-square
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      // We have successfully rotate our square
      expect(
        poly.rotate(Math.PI / 2, scalingFactor).points[0].equal(new Point(1, 0))
      ).toBeTruthy()
    })

    it("rotates correctly poly if new points are not out of 1-square", () => {
      const pointIndex = 0
      const poly = new Polygon(
        [new Point(1, 1), new Point(0, 1), new Point(0, 0), new Point(1, 0)],
        true,
        true
      ).resizeRectangle(new Point(0.5, 0.5), pointIndex)

      expect(poly.points[0].equal(new Point(0.5, 0))).toBeTruthy()
      expect(poly.points[1].equal(new Point(0, 0))).toBeTruthy()
      expect(poly.points[2].equal(new Point(0, 0.5))).toBeTruthy()
      expect(poly.points[3].equal(new Point(0.5, 0.5))).toBeTruthy()
    })
  })

  describe("rotateToPoint()", () => {
    it("rotate to point", () => {
      const poly = new Polygon(
        [
          new Point(0.1, 0.1),
          new Point(0.2, 0.1),
          new Point(0.2, 0.2),
          new Point(0.1, 0.2),
        ],
        true,
        true
      )
      const rotated = poly.rotateToPoint(new Point(0.15, 0.15), 0, [1, 1])
      expect(rotated.points[0].equal(new Point(0.2207, 0.15))).toBeTruthy()
      expect(rotated.points[1].equal(new Point(0.15, 0.2207))).toBeTruthy()
      expect(rotated.points[2].equal(new Point(0.0793, 0.15))).toBeTruthy()
      expect(rotated.points[3].equal(new Point(0.15, 0.0793))).toBeTruthy()
    })
  })

  describe("check if rectangle", () => {
    it("1-square rectangle", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] // 1-square
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.checkIfRectangle()).toBeTruthy()
    })

    it("1-triangle center", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [0.5, 1],
      ] // 1-triangle
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.checkIfRectangle()).toBeFalsy()
    })

    it("weird points", () => {
      const shape = [
        [0, 0],
        [1, 0],
        [-1, 0],
        [0, 1],
      ] // 1-triangle
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.checkIfRectangle()).toBeFalsy()
    })

    it("rotated rectangle", () => {
      const shape = [
        [0.2, 0.4],
        [0.4, 0.2],
        [0.7, 0.5],
        [0.5, 0.7],
      ] // rotated rect
      const poly = new Polygon(shape.map(([x, y]) => new Point(x, y)))
      expect(poly.checkIfRectangle()).toBeTruthy()
    })
  })

  describe("makeRectangle", () => {
    it("no rectangle without any point", () => {
      const poly = new Polygon()
      const rect = poly.makeRectangle(new Point(1, 1))
      rect.checkIfRectangle()
      expect(rect.isRectangle).toBeFalsy()
    })

    it("no rectangle without to many points", () => {
      const poly = new Polygon([
        new Point(),
        new Point(),
        new Point(),
        new Point(),
        new Point(),
      ])
      const rect = poly.makeRectangle(new Point())
      rect.checkIfRectangle()
      expect(rect.isRectangle).toBeFalsy()
    })

    it('new rectangle without any point for "third point"', () => {
      const poly = new Polygon([new Point(1, 1)])
      const rect = poly.makeRectangle()
      rect.checkIfRectangle()
      expect(rect.isRectangle).toBeTruthy()
    })

    it("draw basic 1-length rect", () => {
      const poly = new Polygon([new Point()], false)
      const rect = poly.makeRectangle(new Point(1, 1))
      rect.checkIfRectangle()
      expect(rect.isRectangle).toBeTruthy()
      expect(rect.isClosed).toBeTruthy()
    })

    it("draw rect", () => {
      const poly = new Polygon([new Point(0.3, 0.3)], false)
      const rect = poly.makeRectangle(new Point(0.1, 0.1))
      rect.checkIfRectangle()
      expect(rect.isRectangle).toBeTruthy()
      expect(rect.isClosed).toBeTruthy()
    })

    it("draw rect2", () => {
      const poly = new Polygon([new Point(0.3, 0.3)], false)
      const rect = poly.makeRectangle(new Point(0.1, 0.5))
      rect.checkIfRectangle()
      expect(rect.isRectangle).toBeTruthy()
      expect(rect.isClosed).toBeTruthy()
    })
  })

  describe("normalizeRectangle", () => {
    it("normalize a rectangle if points are not given in a clockwise order", () => {
      const poly = new Polygon([
        new Point(1, 0),
        new Point(0, 0),
        new Point(0, 1),
        new Point(1, 1),
      ])
      const newPoly = poly.normalizeRectangle()
      expect(newPoly.points[0].equal(new Point(1, 0))).toBeTruthy()
    })

    it("does nothing if points are given in a clockwise order", () => {
      const poly = new Polygon([
        new Point(1, 1),
        new Point(0, 1),
        new Point(0, 0),
        new Point(1, 0),
      ])
      const newPoly = poly.normalizeRectangle()
      expect(newPoly.points[0].equal(new Point(1, 0))).toBeTruthy()
    })
  })

  describe("resizeRectangle", () => {
    it("returns original poly if new point is too close from previous", () => {
      const poly = new Polygon(
        [new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(0, 1)],
        true,
        true
      )
      const pointIndex = 0
      expect(
        poly
          .resizeRectangle(new Point(0.99999, 0.99999), pointIndex)
          .points[pointIndex].equal(new Point(0, 0))
      ).toBeTruthy()
    })

    it("returns original poly if new points are out of 1-square", () => {
      const poly = new Polygon(
        [new Point(1, 1), new Point(0, 1), new Point(0, 0), new Point(1, 0)],
        true,
        true
      )
      const pointIndex = 0
      expect(
        poly
          .resizeRectangle(new Point(2, 2), pointIndex)
          .points[pointIndex].equal(new Point(1, 1))
      ).toBeTruthy()
    })

    it("resize rectangle correctly with happy path", () => {
      const poly = new Polygon(
        [
          new Point(0, 1),
          new Point(0.5, 1),
          new Point(0.5, 0.5),
          new Point(0, 0.5),
        ],
        true,
        true
      )
      const newPoly = poly.resizeRectangle(new Point(0.6, 0.6), 2)
      expect(newPoly.points[0].equal(new Point(0, 1))).toBeTruthy()
      expect(newPoly.points[1].equal(new Point(0.6, 1))).toBeTruthy()
      expect(newPoly.points[2].equal(new Point(0.6, 0.6))).toBeTruthy()
      expect(newPoly.points[3].equal(new Point(0, 0.6))).toBeTruthy()
    })

    it("resize rotated rectangle correctly with happy path", () => {
      const poly = new Polygon(
        [
          new Point(0.25, 0.5),
          new Point(0.5, 0.75),
          new Point(0.75, 0.5),
          new Point(0.5, 0.25),
        ],
        true,
        true
      )
      const newPoly = poly.resizeRectangle(new Point(1, 0.5), 2)

      expect(newPoly.points[0].equal(new Point(0.25, 0.5))).toBeTruthy()
      expect(newPoly.points[1].equal(new Point(0.625, 0.875))).toBeTruthy()
      expect(newPoly.points[2].equal(new Point(1, 0.5))).toBeTruthy()
      expect(newPoly.points[3].equal(new Point(0.625, 0.125))).toBeTruthy()
    })

    it("resize rotated rectangle (non square) correctly with happy path (one point updated only)", () => {
      const poly = new Polygon(
        [
          new Point(0, 0.4),
          new Point(0.4, 0.3),
          new Point(0.3, 0),
          new Point(0, 0.1),
        ],
        true,
        true
      )

      const newPoly = poly.resizeRectangle(new Point(0.2, 0.7), 0)
      expect(newPoly.points[0].equal(new Point(0.2, 0.7))).toBeTruthy()
      expect(newPoly.points[1].equal(new Point(0.5, 0.6))).toBeTruthy()
      expect(newPoly.points[2].equal(new Point(0.3, 0))).toBeTruthy()
      expect(newPoly.points[3].equal(new Point(0, 0.1))).toBeTruthy()
    })

    it("resize rotated rectangle (non square) correctly with happy path (two points updated", () => {
      const poly = new Polygon(
        [
          new Point(0, 0.4),
          new Point(0.4, 0.3),
          new Point(0.3, 0),
          new Point(0, 0.1),
        ],
        true,
        true
      )

      const newPoly = poly.resizeRectangle(new Point(0.35, 0.65), 0)
      expect(newPoly.points[0].equal(new Point(0.35, 0.65))).toBeTruthy()
      expect(newPoly.points[1].equal(new Point(0.5, 0.6))).toBeTruthy()
      expect(newPoly.points[2].equal(new Point(0.3, 0))).toBeTruthy()
      expect(newPoly.points[3].equal(new Point(0.15, 0.05))).toBeTruthy()
    })

    it("resize rotated rectangle 2 (non square) correctly with happy path (two points updated", () => {
      const poly = new Polygon(
        [
          new Point(0, 0.4),
          new Point(0.15, 0.45),
          new Point(0.2, 0.3),
          new Point(0.05, 0.25),
        ],
        true,
        true
      )

      const newPoly = poly.resizeRectangle(new Point(0.4, 0.2), 2)
      expect(newPoly.points[0].equal(new Point(0.0, 0.4))).toBeTruthy()
      expect(newPoly.points[1].equal(new Point(0.3, 0.5))).toBeTruthy()
      expect(newPoly.points[2].equal(new Point(0.4, 0.2))).toBeTruthy()
      expect(newPoly.points[3].equal(new Point(0.1, 0.1))).toBeTruthy()
    })
  })

  it("rotate and resize works as expected when combined", () => {
    const poly = new Polygon(
      [
        new Point(0.1, 0.1),
        new Point(0.2, 0.1),
        new Point(0.2, 0.2),
        new Point(0.1, 0.2),
      ],
      true,
      true
    )
    const rotatedPoly = poly.rotate(Math.PI / 4, [1, 1])
    const newPoly = rotatedPoly.resizeRectangle(new Point(0.15, 0), 0)
    expect(newPoly.points[0].equal(new Point(0.0396, 0.1103))).toBeTruthy()
    expect(newPoly.points[1].equal(new Point(0.15, 0.2207))).toBeTruthy()
    expect(newPoly.points[2].equal(new Point(0.2603, 0.1104))).toBeTruthy()
    expect(newPoly.points[3].equal(new Point(0.15, 0))).toBeTruthy()
  })

  it("toInt(): applies to Int on all points", () => {
    const points = [new Point(1.2, 5.8), new Point(500.36, 945.15)]
    const poly = new Polygon(points)
    expect(poly.toInt().map((p) => p.toList())).toEqual([
      [1, 6],
      [500, 945],
    ])
  })
})

describe("getPolygonFromCoordinates", () => {
  it("creates a polygon from a list of coordinates ex:[[1, 2], [3, 4]]", () => {
    const coordinates = [
      [1, 1],
      [2, 2],
      [3, 3],
    ]
    const result = createPolygonFromCoordinates(coordinates)
    expect(result.points[0].equal(new Point(1, 1))).toBeTruthy()
  })
})
