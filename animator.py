import sys
import random
import math
from copy import deepcopy
from lxml import etree as ET

def animate_sparkles(root):
  sparkles = root.findall('.//{http://www.w3.org/2000/svg}g[@id="sparkles"]/{http://www.w3.org/2000/svg}path')

  for sparkle in sparkles:
    sparkle.attrib['style'] += '; transform-origin: center; transform-box: fill-box;'
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
    

def animate_outline(root, copies=3, keyframes=10, maxdist=5):
  outlines = root.findall('.//{http://www.w3.org/2000/svg}g[@id="outlines"]/{http://www.w3.org/2000/svg}path')

  colors = ['#FF7070', '#70FF70', '#7070FF']
  def rand_offset():
    direction = random.uniform(0, math.pi * 2)
    length = maxdist
    return f'{math.cos(direction)*length} {math.sin(direction)*length}'

  for outline in outlines:
    parent = outline.getparent()
    parent.remove(outline)
    for i in range(copies):
      clone = deepcopy(outline)
      clone.attrib['style'] += f'; stroke: {colors[i%len(colors)]}; mix-blend-mode: screen; opacity: 1.0; transform-origin: center; transform-box: fill-box;'

      key_times = [str(i / (keyframes)) for i in range(keyframes + 1)]
      values = [rand_offset() for _ in range(keyframes)]
      values.append(values[0])

      dur = 10
      r = maxdist
      ET.SubElement(clone, 'animateMotion', {
        'path': f'M 0 0 a {r} {r} 0 1 0 {2 * r} 0 a {r} {r} 0 1 0 {-2 * r} 0',
        'dur': '10s',
        'begin': f'{-dur/copies*i}s',
        'keyTimes': ';'.join(key_times),
        'values': ';'.join(values),
        'calcMode': 'linear',
        'repeatCount': 'indefinite',
      })

      # ET.SubElement(clone, 'animateTransform', {
      #   'attributeName': 'transform',
      #   'attributeType': 'XML',
      #   'type': 'translate',
      #   'additive': 'sum',
      #   'fill': 'freeze',
      #   'dur': f'{random.uniform(10, 12)}s',
      #   'keyTimes': ';'.join(key_times),
      #   'values': ';'.join(values),
      #   'calcMode': 'linear',
      #   'repeatCount': 'indefinite',
      # })
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
