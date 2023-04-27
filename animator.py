import sys
import random
import math
from copy import deepcopy
from typing import Tuple
from lxml import etree as ET
from hsluv import hsluv_to_hex

def animate_sparkles(root: ET.ElementBase):
  sparkles = root.findall('.//{http://www.w3.org/2000/svg}g[@id="sparkles"]/{http://www.w3.org/2000/svg}path')

  for sparkle in sparkles:
    sparkle.attrib['style'] = str(sparkle.attrib['style']) + '; transform-origin: center; transform-box: fill-box;'
    ET.SubElement(sparkle, 'animateTransform', {
      'attributeName': 'transform',
      'attributeType': 'XML',
      'type': 'scale',
      'additive': 'sum',
      'fill': 'freeze',
      'begin': f'{random.uniform(-1, 0)}s',
      'dur': f'{random.uniform(0.8, 1.2)}s',
      'keyTimes': '0;0.5;1',
      'values': '0.5;1.0;0.5',
      'keySplines': '0.42 0 1 1; 0 0 0.58 1',
      'calcMode': 'spline',
      'repeatCount': 'indefinite',
    })

def hslerp(a: Tuple[float, float, float], b: Tuple[float, float, float], f: float) -> Tuple[float, float, float]:
  f = max(0, min(1, f))
  ha, sa, la = a
  hb, sb, lb = b
  dh = (hb - ha + 180) % 360 - 180
  ds = sb - sa
  dl = lb - la
  return ((ha + dh * f) % 360, sa + ds * f, la + dl * f)

def animate_outline(root: ET.ElementBase, copies: int=5, r: int=14, dur: int=12):
  outlines = root.findall('.//{http://www.w3.org/2000/svg}g[@id="outlines"]/{http://www.w3.org/2000/svg}path')

  color_to = (51.4, 73.3, 69.2)
  color_from = (251.5, 73.3, 69.2)
  colors = [hsluv_to_hex(hslerp(color_from, color_to, i / (copies - 1))) for i in range(copies)]

  for outline in outlines:
    parent = outline.getparent()
    if parent is None:
      raise Exception('outline should have a parent')

    parent.remove(outline)
    for i in range(copies):
      clone = deepcopy(outline)
      clone.attrib['style'] = f'{str(clone.attrib["style"])}; stroke: {colors[i%len(colors)]}; mix-blend-mode: screen; opacity: 1.0; transform-origin: center; transform-box: fill-box;'

      h = math.sqrt(3) * r / 2
      ET.SubElement(clone, 'animateMotion', {
        'path': f'M {0} {-h/2}, {-r/2} {h/2}, {r/2} {h/2} z',
        'dur': f'{dur}s',
        'begin': f'{-dur/2/copies*i}s',
        'calcMode': 'linear',
        'repeatCount': 'indefinite',
      })
      parent.append(clone)

def animate(inpath: str, outpath: str):
  parser = ET.XMLParser(remove_blank_text=True)
  tree = ET.parse(inpath, parser)
  root = tree.getroot()
  animate_sparkles(root)
  animate_outline(root)

  tree.write(outpath, pretty_print=True)

if __name__ == '__main__':
  if len(sys.argv) < 3:
    raise Exception('usage: python animator.py in.svg out.svg')
  animate(sys.argv[1], sys.argv[2])
