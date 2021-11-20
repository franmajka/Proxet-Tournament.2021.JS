/**
 * Compares two values and returns true if values match the condition
 *
 * In the case of PriorityQueue it will determine heap property and
 * return false if the property is violated
 */
export type CompareFunc<T> = (left: T, right: T) => boolean;

export interface PriorityQueueParams<T> {
  compare: CompareFunc<T>,
  elements?: Array<T>,
}

/**
 * Class that represents priority queue
 *
 * Elements in it sorted by property that is set
 * in constructor as a compare func
 *
 * Implemented as a binary heap
 */
export class PriorityQueue<T> {
  private readonly _compare: CompareFunc<T>;
  private readonly _elements: Array<T>;

  public get length() : number {
    return this._elements.length;
  }

  public get isEmpty() : boolean {
    return !this.length;
  }

  public constructor({ compare, elements = [] } : PriorityQueueParams<T>) {
    this._compare = compare;
    this._elements = [];

    for (const el of elements) {
      this.push(el);
    }
  }

  public push(element: T) : void {
    let current = this._elements.push(element) - 1;

    while (current > 0) {
      const parent = this.getParentIndex(current) as number;

      // If queue meets heap property
      if (this._compare(this._elements[parent], this._elements[current])) {
        break;
      }

      this.swap(parent, current);
      current = parent;
    }
  }


  public front() : T {
    this.throwOnEmpty();

    return this._elements[0];
  }

  public pop() : T {
    this.throwOnEmpty();

    this.swap(0, this.length - 1);
    const ret = this._elements.pop() as T;

    this.heapify(0);

    return ret;
  }


  private getParentIndex(idx: number) : number | null {
    if (idx <= 0) return null;
    return Math.floor((idx - 1) / 2);
  }

  private getLeftChildIndex(idx: number) : number | null {
    const childIdx = (idx * 2) + 1;
    if (childIdx >= this.length) return null;

    return childIdx;
  }

  private getRightChildIndex(idx: number) : number | null {
    const childIdx = (idx * 2) + 2;
    if (childIdx >= this.length) return null;

    return childIdx;
  }


  /**
   * Changes the heap so the heap property is kept
   * Assumes that left and right subtrees are valid heaps
   */
  private heapify(current: number) : void {
    while (true) {
      const left = this.getLeftChildIndex(current);
      const right = this.getRightChildIndex(current);

      let largest = current;

      if (left !== null) {
        if (!this._compare(this._elements[largest], this._elements[left])) {
          largest = left;
        }
      }

      if (right !== null) {
        if (!this._compare(this._elements[largest], this._elements[right])) {
          largest = right;
        }
      }

      if (largest === current) break;

      this.swap(largest, current);
      current = largest;
    }
  }


  private throwOnEmpty() : void {
    if (this.isEmpty) throw new Error("The PriorityQueue is empty");
  }

  private swap(first: number, second: number) : void {
    [
      this._elements[first],
      this._elements[second]
    ] = [
      this._elements[second],
      this._elements[first]
    ];
  }
}
